import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type ProfitReport = {
  total_services: number;
  total_revenue: number;
  total_profit: number;
  services_breakdown?: Array<{
    service: string;
    count: number;
    revenue: number;
    profit: number;
  }>;
};

export type PeriodReport = {
  week_start?: string;
  week_end?: string;
  month_start?: string;
  month_end?: string;
  total_services: number;
  total_revenue: number;
  total_profit: number;
};

export const useProfitReports = () => {
  // Get daily profit report
  const { data: dailyReport, isLoading: isDailyLoading } = useQuery({
    queryKey: ['daily-profit-report'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .rpc('calculate_daily_profits', { target_date: today });
      
      if (error) throw error;
      return data[0] as ProfitReport;
    },
  });

  // Get weekly profit report
  const { data: weeklyReport, isLoading: isWeeklyLoading } = useQuery({
    queryKey: ['weekly-profit-report'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .rpc('calculate_weekly_profits', { target_date: today });
      
      if (error) throw error;
      return data[0] as PeriodReport;
    },
  });

  // Get monthly profit report
  const { data: monthlyReport, isLoading: isMonthlyLoading } = useQuery({
    queryKey: ['monthly-profit-report'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .rpc('calculate_monthly_profits', { target_date: today });
      
      if (error) throw error;
      return data[0] as PeriodReport;
    },
  });

  // Trigger manual report generation
  const generateReport = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('daily-profit-report');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  };

  // Mark booking as completed (to calculate profit)
  const completeBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          completed_at: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', bookingId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error completing booking:', error);
      throw error;
    }
  };

  return {
    dailyReport,
    weeklyReport,
    monthlyReport,
    isDailyLoading,
    isWeeklyLoading,
    isMonthlyLoading,
    generateReport,
    completeBooking,
  };
};