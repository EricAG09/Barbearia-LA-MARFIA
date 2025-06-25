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
  // Get daily profit report
const { data: dailyReport, isLoading: isDailyLoading, error: dailyError } = useQuery({
  queryKey: ['daily-profit-report'],
  queryFn: async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.rpc('calculate_daily_profits', { target_date: today });

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        total_services: 0,
        total_revenue: 0,
        total_profit: 0,
        services_breakdown: []
      };
    }

    return data[0] as ProfitReport;
  },
  refetchInterval: 30000,
});

// Get weekly profit report
const { data: weeklyReport, isLoading: isWeeklyLoading, error: weeklyError } = useQuery({
  queryKey: ['weekly-profit-report'],
  queryFn: async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.rpc('calculate_weekly_profits', { target_date: today });

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        total_services: 0,
        total_revenue: 0,
        total_profit: 0
      };
    }

    return data[0] as PeriodReport;
  },
  refetchInterval: 60000,
});

// Get monthly profit report
const { data: monthlyReport, isLoading: isMonthlyLoading, error: monthlyError } = useQuery({
  queryKey: ['monthly-profit-report'],
  queryFn: async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.rpc('calculate_monthly_profits', { target_date: today });

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        total_services: 0,
        total_revenue: 0,
        total_profit: 0
      };
    }

    return data[0] as PeriodReport;
  },
  refetchInterval: 300000,
});


  // Trigger manual report generation
  const generateReport = async () => {
  const { data, error } = await supabase.functions.invoke('daily-profit-report');
  if (error) throw error;
  return data;
};


  // Mark booking as completed (to calculate profit)
  const completeBooking = async (bookingId: string) => {
  const { error } = await supabase
    .from('bookings')
    .update({ 
      completed_at: new Date().toISOString(),
      status: 'completed'
    })
    .eq('id', bookingId);
  
  if (error) {
    throw error;
  }
};


  // Log errors for debugging
  // if (dailyError) console.error('Erro no relatório diário:', dailyError);
  // if (weeklyError) console.error('Erro no relatório semanal:', weeklyError);
  // if (monthlyError) console.error('Erro no relatório mensal:', monthlyError);

  return {
    dailyReport,
    weeklyReport,
    monthlyReport,
    isDailyLoading,
    isWeeklyLoading,
    isMonthlyLoading,
    dailyError,
    weeklyError,
    monthlyError,
    generateReport,
    completeBooking,
  };
};
