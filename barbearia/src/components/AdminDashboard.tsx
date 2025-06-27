import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useProfitReports } from '@/hooks/useProfitReports';
import { useBookings } from '@/hooks/useBookings';
import ProfitReports from './ProfitReports';
import BookingsByDay from './BookingsByDay';
import AvailabilityManager from './AvailabilityManager';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const { 
    dailyReport, 
    weeklyReport, 
    monthlyReport, 
    isDailyLoading, 
    isWeeklyLoading, 
    isMonthlyLoading,
    dailyError,
    weeklyError,
    monthlyError
  } = useProfitReports();
  const { bookings, isLoading: isBookingsLoading } = useBookings();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              Painel Administrativo
            </h1>
            <Button variant="outline" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profits" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 h-auto p-1 gap-1">
            <TabsTrigger value="profits" className="text-sm px-3 py-2 h-auto whitespace-normal text-center">
              Relatórios de Lucro
            </TabsTrigger>
            <TabsTrigger value="bookings" className="text-sm px-3 py-2 h-auto whitespace-normal text-center">
              Agendamentos por Dia
            </TabsTrigger>
            <TabsTrigger value="availability" className="text-sm px-3 py-2 h-auto whitespace-normal text-center">
              Disponibilidade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profits" className="space-y-6">
            <ProfitReports 
              dailyReport={dailyReport}
              weeklyReport={weeklyReport}
              monthlyReport={monthlyReport}
              isDailyLoading={isDailyLoading}
              isWeeklyLoading={isWeeklyLoading}
              isMonthlyLoading={isMonthlyLoading}
              dailyError={dailyError}
              weeklyError={weeklyError}
              monthlyError={monthlyError}
            />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <BookingsByDay 
              bookings={bookings}
              isLoading={isBookingsLoading}
            />
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <AvailabilityManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;