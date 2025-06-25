import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfitReport, PeriodReport } from '@/hooks/useProfitReports';

interface ProfitReportsProps {
  dailyReport?: ProfitReport;
  weeklyReport?: PeriodReport;
  monthlyReport?: PeriodReport;
  isDailyLoading: boolean;
  isWeeklyLoading: boolean;
  isMonthlyLoading: boolean;
  dailyError?: any;
  weeklyError?: any;
  monthlyError?: any;
}

const ProfitReports = ({ 
  dailyReport, 
  weeklyReport, 
  monthlyReport, 
  isDailyLoading, 
  isWeeklyLoading, 
  isMonthlyLoading,
  dailyError,
  weeklyError,
  monthlyError
}: ProfitReportsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  const renderReportContent = (
    report: ProfitReport | PeriodReport | undefined,
    isLoading: boolean,
    error: any,
    type: 'daily' | 'weekly' | 'monthly'
  ) => {
    if (isLoading) {
      return <div className="text-center py-4">Carregando...</div>;
    }

    if (error) {
      return (
        <div className="text-center py-4 text-red-500">
          <p>Erro ao carregar dados</p>
          <p className="text-xs mt-2">{error.message}</p>
        </div>
      );
    }

    if (!report) {
      return (
        <div className="text-center py-4 text-gray-500">
          Nenhum dado disponível
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Serviços:</span>
          <span className="font-semibold">{report.total_services || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Faturamento:</span>
          <span className="font-semibold text-green-600">
            {formatCurrency(Number(report.total_revenue || 0))}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Lucro:</span>
          <span className="font-semibold text-blue-600">
            {formatCurrency(Number(report.total_profit || 0))}
          </span>
        </div>
        
        {type === 'daily' && 'services_breakdown' in report && report.services_breakdown && Array.isArray(report.services_breakdown) && report.services_breakdown.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold mb-2">Detalhamento:</h4>
            {report.services_breakdown.map((service: any, index: number) => (
              <div key={index} className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>{service.service}:</span>
                  <span>{service.count}x</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Relatório Diário */}
        <Card>
          <CardHeader>
            <CardTitle>Hoje</CardTitle>
            <CardDescription>Relatório do dia atual</CardDescription>
          </CardHeader>
          <CardContent>
            {renderReportContent(dailyReport, isDailyLoading, dailyError, 'daily')}
          </CardContent>
        </Card>

        {/* Relatório Semanal */}
        <Card>
          <CardHeader>
            <CardTitle>Esta Semana</CardTitle>
            <CardDescription>Relatório semanal</CardDescription>
          </CardHeader>
          <CardContent>
            {renderReportContent(weeklyReport, isWeeklyLoading, weeklyError, 'weekly')}
          </CardContent>
        </Card>

        {/* Relatório Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Este Mês</CardTitle>
            <CardDescription>Relatório mensal</CardDescription>
          </CardHeader>
          <CardContent>
            {renderReportContent(monthlyReport, isMonthlyLoading, monthlyError, 'monthly')}
          </CardContent>
        </Card>
      </div>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Debug</CardTitle>
          <CardDescription>Para identificar possíveis problemas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Data atual:</strong> {new Date().toLocaleDateString('pt-BR')}
            </div>
            <div>
              <strong>Status Diário:</strong> {isDailyLoading ? 'Carregando...' : dailyError ? 'Erro' : 'OK'}
            </div>
            <div>
              <strong>Status Semanal:</strong> {isWeeklyLoading ? 'Carregando...' : weeklyError ? 'Erro' : 'OK'}
            </div>
            <div>
              <strong>Status Mensal:</strong> {isMonthlyLoading ? 'Carregando...' : monthlyError ? 'Erro' : 'OK'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitReports;