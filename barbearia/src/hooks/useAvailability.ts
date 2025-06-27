import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export interface ClosedPeriod {
  date: string;
  isMorningClosed: boolean;
  isAfternoonClosed: boolean;
  isFullDayClosed: boolean;
}

export const useAvailability = () => {
  const [closedPeriods, setClosedPeriods] = useState<ClosedPeriod[]>([]);

  useEffect(() => {
    // Carregar dados do localStorage ao inicializar
    const saved = localStorage.getItem('barbershop-closed-periods');
    if (saved) {
      try {
        setClosedPeriods(JSON.parse(saved));
      } catch (error) {
        console.error('Erro ao carregar disponibilidade:', error);
      }
    }
  }, []);

  const isDateAvailable = (date: Date, time: string) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const period = closedPeriods.find(p => p.date === dateString);
    
    if (!period) return true; // Sem restrições para esta data
    
    if (period.isFullDayClosed) return false; // Dia inteiro fechado
    
    const hour = parseInt(time.split(':')[0]);
    
    // Manhã: 09:00 - 12:00
    if (hour >= 9 && hour < 12 && period.isMorningClosed) {
      return false;
    }
    
    // Tarde: 13:00 - 18:00
    if (hour >= 13 && hour <= 18 && period.isAfternoonClosed) {
      return false;
    }
    
    return true;
  };

  const getUnavailableMessage = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const period = closedPeriods.find(p => p.date === dateString);
    
    if (!period) return null;
    
    if (period.isFullDayClosed) {
      return "Barbearia fechada neste dia";
    }
    
    const messages = [];
    if (period.isMorningClosed) messages.push("manhã");
    if (period.isAfternoonClosed) messages.push("tarde");
    
    return `Barbearia fechada na ${messages.join(" e ")}`;
  };

  return {
    closedPeriods,
    isDateAvailable,
    getUnavailableMessage,
  };
};