import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarX, Clock, Save } from 'lucide-react';

interface ClosedPeriod {
  date: string;
  isMorningClosed: boolean;
  isAfternoonClosed: boolean;
  isFullDayClosed: boolean;
}

const AvailabilityManager = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [closedPeriods, setClosedPeriods] = useState<ClosedPeriod[]>([]);
  const [isMorningClosed, setIsMorningClosed] = useState(false);
  const [isAfternoonClosed, setIsAfternoonClosed] = useState(false);
  const [isFullDayClosed, setIsFullDayClosed] = useState(false);
  const { toast } = useToast();

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    const dateString = format(date, 'yyyy-MM-dd');
    const existingPeriod = closedPeriods.find(p => p.date === dateString);
    
    if (existingPeriod) {
      setIsMorningClosed(existingPeriod.isMorningClosed);
      setIsAfternoonClosed(existingPeriod.isAfternoonClosed);
      setIsFullDayClosed(existingPeriod.isFullDayClosed);
    } else {
      setIsMorningClosed(false);
      setIsAfternoonClosed(false);
      setIsFullDayClosed(false);
    }
  };

  const handleFullDayToggle = (checked: boolean) => {
    setIsFullDayClosed(checked);
    if (checked) {
      setIsMorningClosed(true);
      setIsAfternoonClosed(true);
    }
  };

  const handleSaveAvailability = () => {
    if (!selectedDate) {
      toast({
        title: "Erro",
        description: "Selecione uma data primeiro",
        variant: "destructive",
      });
      return;
    }

    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const updatedPeriods = closedPeriods.filter(p => p.date !== dateString);
    
    // Só adiciona se pelo menos um período estiver fechado
    if (isMorningClosed || isAfternoonClosed || isFullDayClosed) {
      updatedPeriods.push({
        date: dateString,
        isMorningClosed: isFullDayClosed || isMorningClosed,
        isAfternoonClosed: isFullDayClosed || isAfternoonClosed,
        isFullDayClosed,
      });
    }

    setClosedPeriods(updatedPeriods);
    
    // Aqui você salvaria no banco de dados/localStorage
    localStorage.setItem('barbershop-closed-periods', JSON.stringify(updatedPeriods));
    
    toast({
      title: "Disponibilidade Atualizada",
      description: `Configuração salva para ${format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}`,
    });
  };

  const getClosedDates = () => {
    return closedPeriods
      .filter(p => p.isFullDayClosed)
      .map(p => new Date(p.date));
  };

  const getPartiallyClosedDates = () => {
    return closedPeriods
      .filter(p => !p.isFullDayClosed && (p.isMorningClosed || p.isAfternoonClosed))
      .map(p => new Date(p.date));
  };

  const isDateClosed = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const period = closedPeriods.find(p => p.date === dateString);
    return period?.isFullDayClosed || false;
  };

  const isDatePartiallyClosed = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const period = closedPeriods.find(p => p.date === dateString);
    return period && !period.isFullDayClosed && (period.isMorningClosed || period.isAfternoonClosed);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarX className="h-5 w-5" />
            Gerenciar Disponibilidade
          </CardTitle>
          <CardDescription>
            Configure os dias e horários em que a barbearia estará fechada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendário */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Selecione uma data:</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                locale={ptBR}
                className="rounded-md border"
                modifiers={{
                  closed: getClosedDates(),
                  'partially-closed': getPartiallyClosedDates(),
                }}
                modifiersClassNames={{
                  closed: 'bg-red-100 text-red-900 font-bold',
                  'partially-closed': 'bg-yellow-100 text-yellow-900 font-bold',
                }}
              />
              
              {/* Legenda */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span>Dia totalmente fechado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span>Parcialmente fechado</span>
                </div>
              </div>
            </div>

            {/* Configurações de Horário */}
            <div className="space-y-6">
              {selectedDate && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    Configurar: {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
                  </Label>

                  <div className="space-y-4 border rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="full-day"
                        checked={isFullDayClosed}
                        onCheckedChange={handleFullDayToggle}
                      />
                      <Label htmlFor="full-day" className="flex items-center gap-2">
                        <CalendarX className="h-4 w-4" />
                        Fechar o dia inteiro
                      </Label>
                    </div>

                    {!isFullDayClosed && (
                      <div className="space-y-3 pl-6 border-l-2 border-gray-200">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="morning"
                            checked={isMorningClosed}
                            onCheckedChange={setIsMorningClosed}
                          />
                          <Label htmlFor="morning" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Manhã (09:00 - 12:00)
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="afternoon"
                            checked={isAfternoonClosed}
                            onCheckedChange={setIsAfternoonClosed}
                          />
                          <Label htmlFor="afternoon" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Tarde (13:00 - 18:00)
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button onClick={handleSaveAvailability} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Configuração
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Períodos Fechados */}
      {closedPeriods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Períodos Fechados Configurados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {closedPeriods.map((period) => (
                <div key={period.date} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">
                      {format(new Date(period.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                    <div className="flex gap-2 mt-1">
                      {period.isFullDayClosed ? (
                        <Badge variant="destructive">Dia inteiro fechado</Badge>
                      ) : (
                        <>
                          {period.isMorningClosed && <Badge variant="secondary">Manhã fechada</Badge>}
                          {period.isAfternoonClosed && <Badge variant="secondary">Tarde fechada</Badge>}
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDateSelect(new Date(period.date))}
                  >
                    Editar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AvailabilityManager;