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

  // Criar nova reserva
  const createBooking = useMutation({
    mutationFn: async (booking: Booking) => {
      console.log('Criando agendamento:', booking);
      
      try {
        const bookingData = {
          name: booking.name,
          phone: booking.phone,
          service: booking.service,
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          status: 'confirmed',
          booking_type: booking.booking_type || 'scheduled'
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
    SERVICE_DURATIONS,
  };
};
