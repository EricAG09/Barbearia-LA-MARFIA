import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format, parseISO, getDay, startOfWeek, endOfWeek, addWeeks, subWeeks, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Booking } from '@/hooks/useBookings';

interface BookingsByDayProps {
  bookings: Booking[];
  isLoading: boolean;
}

const BookingsByDay = ({ bookings, isLoading }: BookingsByDayProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const daysOfWeek = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  const getWeekRange = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 0 }); // Domingo como primeiro dia
    const end = endOfWeek(date, { weekStartsOn: 0 });
    return { start, end };
  };

  const getCurrentWeekBookings = () => {
    const { start, end } = getWeekRange(currentWeek);
    
    return bookings.filter((booking) => {
      try {
        const bookingDate = parseISO(booking.booking_date);
        return isWithinInterval(bookingDate, { start, end });
      } catch {
        return false;
      }
    });
  };

  const groupBookingsByDay = () => {
    const grouped: { [key: number]: Booking[] } = {};
    
    for (let i = 0; i < 7; i++) {
      grouped[i] = [];
    }

    const weekBookings = getCurrentWeekBookings();
    
    weekBookings.forEach((booking) => {
      try {
        const dayOfWeek = getDay(parseISO(booking.booking_date));
        grouped[dayOfWeek].push(booking);
      } catch {
        // erro ignorado
      }
    });

    return grouped;
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5); // Remove segundos do HH:MM:SS
  };

  const formatCurrency = (value?: number) => {
    if (value == null) return '-';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentWeek(subWeeks(currentWeek, 1));
    } else {
      setCurrentWeek(addWeeks(currentWeek, 1));
    }
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos da Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Carregando agendamentos...</div>
        </CardContent>
      </Card>
    );
  }

  const { start, end } = getWeekRange(currentWeek);
  const groupedBookings = groupBookingsByDay();
  const totalWeekBookings = getCurrentWeekBookings().length;

  return (
    <div className="space-y-6">
      {/* Controles de Navegação */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Agendamentos da Semana</CardTitle>
              <CardDescription>
                {format(start, 'dd/MM/yyyy', { locale: ptBR })} - {format(end, 'dd/MM/yyyy', { locale: ptBR })}
                <br />
                {totalWeekBookings} agendamento(s) nesta semana
              </CardDescription>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')} className="w-full sm:w-auto">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              <Button variant="outline" size="sm" onClick={goToCurrentWeek} className="w-full sm:w-auto">
                Esta Semana
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateWeek('next')} className="w-full sm:w-auto">
                Próxima
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Agendamentos por Dia */}
      {daysOfWeek.map((dayName, dayIndex) => (
        <Card key={dayIndex}>
          <CardHeader>
            <CardTitle>{dayName}</CardTitle>
            <CardDescription>{groupedBookings[dayIndex].length} agendamento(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {groupedBookings[dayIndex].length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Nenhum agendamento para {dayName.toLowerCase()}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Cliente</TableHead>
                      <TableHead className="min-w-[100px]">Telefone</TableHead>
                      <TableHead className="min-w-[100px]">Serviço</TableHead>
                      <TableHead className="min-w-[90px]">Data</TableHead>
                      <TableHead className="min-w-[70px]">Horário</TableHead>
                      <TableHead className="min-w-[90px]">Valor (R$)</TableHead> {/* NOVO */}
                      <TableHead className="min-w-[90px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedBookings[dayIndex].map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.name}</TableCell>
                        <TableCell>{booking.phone}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>
                          {format(parseISO(booking.booking_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>{formatTime(booking.booking_time)}</TableCell>
                        <TableCell>{formatCurrency(booking.profit_amount)}</TableCell> {/* NOVO */}
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {booking.status === 'completed' ? 'Concluído' : 'Confirmado'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookingsByDay;
