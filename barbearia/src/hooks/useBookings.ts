import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { parseISO, addMinutes, isBefore, isAfter } from 'date-fns';
import { format } from 'date-fns';

export type Booking = {
  id?: string;
  name: string;
  phone: string;
  service: string | string[]; // pode ser string ou array de serviços
  booking_date: string;
  booking_time: string;
  status?: string;
  completed_at?: string;
  profit_amount?: number;
  duration?: number; 
  booking_type?: 'scheduled' | 'walk_in';
};

// Durações padrão dos serviços (em minutos)
export const SERVICE_DURATIONS: Record<string, number> = {
  "corte-social": 30,
  "corte-degrade": 30,
  "corte-infantil": 25,
  "sobrancelha": 10,
  "barba": 20,
  "corte-degrade-barba": 50,
  "corte-degrade-pigmentacao": 45,
  "corte-degrade-pigmentacao-barba": 65,
};

// Valores padrão para cada serviço (exemplo, ajuste conforme seu negócio)
export const SERVICE_PRICES: Record<string, number> = {
  "corte-social": 50,
  "corte-degrade": 60,
  "corte-infantil": 40,
  "sobrancelha": 20,
  "barba": 35,
  "corte-degrade-barba": 80,
  "corte-degrade-pigmentacao": 70,
  "corte-degrade-pigmentacao-barba": 100,
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

  // Função para calcular valor total dos serviços selecionados
  const calculateTotalPrice = (services: string[]) => {
    return services.reduce((total, serviceId) => {
      return total + (SERVICE_PRICES[serviceId] || 50);
    }, 0);
  };

  // Função para validar se o horário está disponível para o serviço
const isTimeSlotAvailable = async (
  booking_date: string,
  booking_time: string,
  service: string | string[]
) => {
  const servicesArray = Array.isArray(service) ? service : [service];

  // Soma todas as durações
  const requestedDuration = servicesArray.reduce((total, serv) => {
    return total + (SERVICE_DURATIONS[serv] || 30); // padrão 30min
  }, 0);

  const startNew = parseISO(`${booking_date}T${booking_time}`);
  const endNew = addMinutes(startNew, requestedDuration);

  // Pega todos os agendamentos daquele dia
  const { data: existingBookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_date', booking_date);

  if (error) throw error;

  for (const booking of existingBookings || []) {
    const bookedServices = Array.isArray(booking.service)
      ? booking.service
      : [booking.service];

    const bookedDuration = bookedServices.reduce((total, s) => {
      return total + (SERVICE_DURATIONS[s] || 30);
    }, 0);

    const startExisting = parseISO(`${booking.booking_date}T${booking.booking_time}`);
    const endExisting = addMinutes(startExisting, bookedDuration);

    // Verifica se há sobreposição de horário
    const overlaps = startNew < endExisting && endNew > startExisting;
    if (overlaps) {
      return false;
    }
  }

  return true;
};


  // Criar nova reserva
  const createBooking = useMutation({
    mutationFn: async (booking: Booking) => {
      console.log('Criando agendamento:', booking);

      // Garantir array para serviços
      const servicesArray = Array.isArray(booking.service) ? booking.service : [booking.service];

      // Verificar se horário está disponível
      const available = await isTimeSlotAvailable(booking.booking_date, booking.booking_time, servicesArray);
      if (!available) {
        throw new Error('Horário já ocupado para um dos serviços selecionados.');
      }

      // Calcular valor total dos serviços
      const totalPrice = calculateTotalPrice(servicesArray);

      try {
        const bookingData = {
          name: booking.name,
          phone: booking.phone,
          service: servicesArray,
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          status: 'confirmed',
          booking_type: booking.booking_type || 'scheduled',
          profit_amount: totalPrice,
          duration: calculateTotalDuration(servicesArray),
        };

        console.log('Dados do agendamento para inserir:', bookingData);

        const { data, error } = await supabase
          .from('bookings')
          .insert([bookingData])
          .select()
          .single();

        if (error) {
          console.error('Erro ao inserir no Supabase:', error);
          throw new Error(`Erro ao criar agendamento: ${error.message}`);
        }

        console.log('Agendamento criado com sucesso:', data);
        return data;
      } catch (error) {
        console.error('Erro geral ao criar agendamento:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Invalidando queries após criação do agendamento');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['daily-profit-report'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-profit-report'] });
      queryClient.invalidateQueries({ queryKey: ['monthly-profit-report'] });
    },
    onError: (error) => {
      console.error('Erro na mutation de criar agendamento:', error);
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

  return {
    bookings,
    isLoading,
    createBooking,
    completeBooking,
    getBookingsByDate,
    calculateTotalDuration,
    calculateTotalPrice,
    SERVICE_DURATIONS,
    SERVICE_PRICES,
  };
};
