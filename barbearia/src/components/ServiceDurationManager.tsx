import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Clock, Save } from 'lucide-react';
import { SERVICE_DURATIONS } from '@/hooks/useBookings';

const services = [
  { id: "corte-social", name: "Corte Social" },
  { id: "corte-degrade", name: "Corte Degradê" },
  { id: "corte-degrade-barba", name: "Corte Degradê + Barba" },
  { id: "corte-degrade-pigmentacao", name: "Corte Degradê + Pigmentação" },
  { id: "corte-degrade-pigmentacao-barba", name: "Corte Degradê + Pigmentação + Barba" },
  { id: "corte-completo", name: "Corte Degradê + Pigmentação + Barba + Sobrancelha" },
  { id: "corte-social-pigmentacao-barba", name: "Corte Social + Pigmentação + Barba" },
  { id: "corte-degrade-sobrancelha", name: "Corte Degradê + Sobrancelha" },
  { id: "corte-social-barba", name: "Corte Social + Barba" },
  { id: "corte-infantil", name: "Corte Infantil" },
  { id: "sobrancelha", name: "Sobrancelha" },
  { id: "barba", name: "Barba" },
  { id: "platinado", name: "Platinado" },
  { id: "luzes", name: "Luzes" },
  { id: "pezinho", name: "Pezinho" },
];

const ServiceDurationManager = () => {
  const [durations, setDurations] = useState<Record<string, number>>(SERVICE_DURATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDurationChange = (serviceId: string, duration: string) => {
    const durationNumber = parseInt(duration) || 0;
    setDurations(prev => ({
      ...prev,
      [serviceId]: durationNumber
    }));
  };

  const saveDurations = () => {
    setIsLoading(true);
    
    try {
      // Salvar no localStorage (você pode implementar salvamento no backend aqui)
      localStorage.setItem('service-durations', JSON.stringify(durations));
      
      toast({
        title: "Durações Salvas",
        description: "As durações dos serviços foram atualizadas com sucesso!",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar as durações dos serviços.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <CardTitle>Duração dos Serviços</CardTitle>
        </div>
        <CardDescription>
          Configure o tempo necessário para cada serviço. Isso afetará a disponibilidade de horários.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.id} className="space-y-2">
              <Label htmlFor={service.id} className="text-sm font-medium">
                {service.name}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={service.id}
                  type="number"
                  min="5"
                  max="300"
                  step="5"
                  value={durations[service.id] || 30}
                  onChange={(e) => handleDurationChange(service.id, e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-gray-500">min</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={saveDurations}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Salvando..." : "Salvar Durações"}
          </Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Como funciona:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Cada serviço bloqueia horários subsequentes baseado na duração</li>
            <li>• Exemplo: Corte de 45min às 10:00 bloqueia até 10:45</li>
            <li>• Clientes só podem marcar em horários que não conflitem</li>
            <li>• Durações são somadas quando múltiplos serviços são selecionados</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceDurationManager;