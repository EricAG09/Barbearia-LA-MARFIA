import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export type Booking = {
  id?: string;
  name: string;
  phone: string;
  service: string;
  booking_date: string;
  booking_time: string;
  status?: string;
  completed_at?: string;
  profit_amount?: number;
  duration?: number; // duração em minutos
};

// Durações padrão dos serviços (em minutos)
export const SERVICE_DURATIONS: Record<string, number> = {
  "corte-social": 30,
  "corte-degrade": 45,
  "corte-degrade-barba": 60,
  "corte-degrade-pigmentacao": 75,
  "corte-degrade-pigmentacao-barba": 90,
  "corte-completo": 120,
  "corte-social-pigmentacao-barba": 75,
  "corte-degrade-sobrancelha": 50,
  "corte-social-barba": 45,
  "corte-infantil": 25,
  "sobrancelha": 15,
  "barba": 20,
  "platinado": 180,
  "luzes": 120,
  "pezinho": 10,
};

export const useBookings = () => {
  const queryClient = useQueryClient();

  // Buscar todas as reservas
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Função para calcular duração total dos serviços selecionados
  const calculateTotalDuration = (services: string[]) => {
    return services.reduce((total, serviceId) => {
      return total + (SERVICE_DURATIONS[serviceId] || 30);
    }, 0);
  };

  // Função para gerar slots de tempo bloqueados por um agendamento
  const getBlockedTimeSlots = (startTime: string, duration: number) => {
    const timeSlots = [
      "09:00", "09:15", "09:20", "09:38", "09:40", "09:45", "10:00", "10:15", "10:20", "10:38", "10:40", "10:45",
      "11:00", "11:15", "11:38", "12:00", "13:00", "13:15", "13:20", "13:30", "13:40", "13:45", "14:00",
      "14:15", "14:20", "14:38", "14:40", "14:45", "15:00", "15:15", "15:20", "15:38", "15:40", "15:45", "16:00",
      "16:15", "16:20", "16:38", "16:40", "16:45", "17:00", "17:15", "17:20", "17:38", "17:40", "17:45", "18:00",
    ];

    const startIndex = timeSlots.indexOf(startTime);
    if (startIndex === -1) return [];

    const blockedSlots = [startTime];
    const currentTime = new Date(`2000-01-01T${startTime}:00`);
    let remainingDuration = duration;

    while (remainingDuration > 0) {
      currentTime.setMinutes(currentTime.getMinutes() + 15);
      const nextTimeSlot = currentTime.toTimeString().slice(0, 5);
      
      if (timeSlots.includes(nextTimeSlot)) {
        blockedSlots.push(nextTimeSlot);
      }
      
      remainingDuration -= 15;
    }

    return blockedSlots.filter(slot => timeSlots.includes(slot));
  };

  // Verificar se um horário está disponível considerando durações
  const checkAvailability = async (date: Date, time: string, selectedServices: string[] = []) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const duration = calculateTotalDuration(selectedServices);
    
    // Buscar todos os agendamentos do dia
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_date', dateString)
      .eq('status', 'confirmed');
    
    if (error) throw error;

    // Verificar se o horário solicitado conflita com agendamentos existentes
    for (const booking of data) {
      const bookingServices = booking.service.split(', ');
      const bookingDuration = calculateTotalDuration(bookingServices);
      const blockedSlots = getBlockedTimeSlots(booking.booking_time, bookingDuration);
      
      // Verificar se o horário solicitado está nos slots bloqueados
      if (blockedSlots.includes(time)) {
        return false;
      }

      // Verificar se os slots do novo agendamento conflitam com o existente
      const newBookingSlots = getBlockedTimeSlots(time, duration);
      const hasConflict = newBookingSlots.some(slot => blockedSlots.includes(slot));
      
      if (hasConflict) {
        return false;
      }
    }
    
    return true;
  };

  // Criar nova reserva
  const createBooking = useMutation({
    mutationFn: async (booking: Booking) => {
      console.log('Criando agendamento:', booking);
      
      // Get profit amount for the service
      const { data: serviceProfit, error: profitError } = await supabase
        .from('service_profits')
        .select('profit_amount')
        .eq('service_id', booking.service)
        .single();
      
      if (profitError) {
        console.log('Erro ao buscar lucro do serviço, usando valor padrão:', profitError);
      }

      // Calcular duração total dos serviços
      const services = booking.service.split(', ');
      const totalDuration = calculateTotalDuration(services);

      const bookingWithProfit = {
        ...booking,
        profit_amount: serviceProfit?.profit_amount || 0,
        duration: totalDuration,
        completed_at: new Date().toISOString(),
        status: 'confirmed'
      };

      console.log('Agendamento com lucro e duração:', bookingWithProfit);

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingWithProfit])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar agendamento:', error);
        throw error;
      }

      console.log('Agendamento criado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Invalidando queries após criação do agendamento');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['daily-profit-report'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-profit-report'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-profit-report'] });
    },
  });

  // Marcar agendamento como concluído
  const completeBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          completed_at: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', bookingId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['daily-profit-report'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-profit-report'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-profit-report'] });
    },
  });

  // Buscar reservas por data
  const getBookingsByDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return bookings.filter(booking => booking.booking_date === dateString);
  };

  // Obter horários bloqueados para uma data específica
  const getBlockedTimeSlotsForDate = (date: Date) => {
    const dayBookings = getBookingsByDate(date);
    const blockedSlots: string[] = [];

    dayBookings.forEach(booking => {
      const services = booking.service.split(', ');
      const duration = calculateTotalDuration(services);
      const slots = getBlockedTimeSlots(booking.booking_time, duration);
      blockedSlots.push(...slots);
    });

    return [...new Set(blockedSlots)]; // Remove duplicatas
  };

  return {
    bookings,
    isLoading,
    checkAvailability,
    createBooking,
    completeBooking,
    getBookingsByDate,
    getBlockedTimeSlotsForDate,
    calculateTotalDuration,
    SERVICE_DURATIONS,
  };
};
