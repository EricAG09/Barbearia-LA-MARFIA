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
};

export const useBookings = () => {
  const queryClient = useQueryClient();

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

  const checkAvailability = async (date: Date, time: string) => {
    const dateString = format(date, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('booking_date', dateString)
      .eq('booking_time', time)
      .eq('status', 'confirmed');

    if (error) throw error;
    return data.length === 0;
  };

  // ✅ Corrigido: tudo dentro da mutationFn e inserção única
  const createBooking = useMutation({
    mutationFn: async (booking: Booking) => {
      // Busca o lucro associado ao serviço
      const { data: serviceProfit, error: profitError } = await supabase
        .from('service_profits')
        .select('profit_amount')
        .eq('service_id', booking.service)
        .single();

      if (profitError) throw profitError;

      const bookingWithProfit = {
        ...booking,
        profit_amount: serviceProfit?.profit_amount || 0,
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingWithProfit])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

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

  const getBookingsByDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return bookings.filter(booking => booking.booking_date === dateString);
  };

  return {
    bookings,
    isLoading,
    checkAvailability,
    createBooking,
    completeBooking,
    getBookingsByDate,
  };
};
