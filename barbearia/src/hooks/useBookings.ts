
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

  // Verificar se um horário está disponível
  const checkAvailability = async (date: Date, time: string) => {
    const dateString = format(date, 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('booking_date', dateString)
      .eq('booking_time', time)
      .eq('status', 'confirmed');
    
    if (error) throw error;
    return data.length === 0; // true se disponível
  };

  // Criar nova reserva
  const createBooking = useMutation({
    mutationFn: async (booking: Booking) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
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
    checkAvailability,
    createBooking,
    getBookingsByDate,
  };
};