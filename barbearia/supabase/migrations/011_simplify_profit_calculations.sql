-- Simplificar as funções de cálculo de lucro
-- Remover funções existentes primeiro
DROP FUNCTION IF EXISTS calculate_daily_profits(DATE);
DROP FUNCTION IF EXISTS calculate_weekly_profits(DATE);
DROP FUNCTION IF EXISTS calculate_monthly_profits(DATE);

-- Função para calcular lucros diários
CREATE OR REPLACE FUNCTION calculate_daily_profits(target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  total_services INTEGER,
  total_revenue DECIMAL(10,2),
  total_profit DECIMAL(10,2),
  services_breakdown JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH bookings_with_services AS (
    SELECT 
      b.service,
      COUNT(*) as service_count,
      -- Preços base dos serviços
      CASE 
        WHEN b.service = 'corte-social' THEN 25.00
        WHEN b.service = 'corte-degrade' THEN 35.00
        WHEN b.service = 'corte-degrade-barba' THEN 50.00
        WHEN b.service = 'corte-degrade-pigmentacao' THEN 60.00
        WHEN b.service = 'corte-degrade-pigmentacao-barba' THEN 75.00
        WHEN b.service = 'corte-completo' THEN 90.00
        WHEN b.service = 'corte-social-pigmentacao-barba' THEN 65.00
        WHEN b.service = 'corte-degrade-sobrancelha' THEN 40.00
        WHEN b.service = 'corte-social-barba' THEN 40.00
        WHEN b.service = 'corte-infantil' THEN 20.00
        WHEN b.service = 'sobrancelha' THEN 10.00
        WHEN b.service = 'barba' THEN 15.00
        WHEN b.service = 'platinado' THEN 120.00
        WHEN b.service = 'luzes' THEN 80.00
        WHEN b.service = 'pezinho' THEN 8.00
        ELSE 25.00
      END::DECIMAL(10,2) as service_price,
      -- Lucros dos serviços
      CASE 
        WHEN b.service = 'corte-social' THEN 15.00
        WHEN b.service = 'corte-degrade' THEN 22.00
        WHEN b.service = 'corte-degrade-barba' THEN 32.00
        WHEN b.service = 'corte-degrade-pigmentacao' THEN 38.00
        WHEN b.service = 'corte-degrade-pigmentacao-barba' THEN 48.00
        WHEN b.service = 'corte-completo' THEN 58.00
        WHEN b.service = 'corte-social-pigmentacao-barba' THEN 42.00
        WHEN b.service = 'corte-degrade-sobrancelha' THEN 26.00
        WHEN b.service = 'corte-social-barba' THEN 26.00
        WHEN b.service = 'corte-infantil' THEN 12.00
        WHEN b.service = 'sobrancelha' THEN 7.00
        WHEN b.service = 'barba' THEN 10.00
        WHEN b.service = 'platinado' THEN 80.00
        WHEN b.service = 'luzes' THEN 55.00
        WHEN b.service = 'pezinho' THEN 5.00
        ELSE 15.00
      END::DECIMAL(10,2) as service_profit
    FROM bookings b
    WHERE b.booking_date = target_date 
      AND b.status = 'confirmed'
    GROUP BY b.service
  )
  SELECT 
    COALESCE(SUM(bws.service_count), 0)::INTEGER as total_services,
    COALESCE(SUM(bws.service_count * bws.service_price), 0.00)::DECIMAL(10,2) as total_revenue,
    COALESCE(SUM(bws.service_count * bws.service_profit), 0.00)::DECIMAL(10,2) as total_profit,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'service', bws.service,
          'count', bws.service_count,
          'revenue', bws.service_count * bws.service_price,
          'profit', bws.service_count * bws.service_profit
        )
      ), 
      '[]'::jsonb
    ) as services_breakdown
  FROM bookings_with_services bws;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular lucros semanais
CREATE OR REPLACE FUNCTION calculate_weekly_profits(target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  week_start DATE,
  week_end DATE,
  total_services INTEGER,
  total_revenue DECIMAL(10,2),
  total_profit DECIMAL(10,2)
) AS $$
DECLARE
  week_start_date DATE;
  week_end_date DATE;
BEGIN
  week_start_date := target_date - (EXTRACT(DOW FROM target_date)::INTEGER - 1);
  week_end_date := week_start_date + 6;
  
  RETURN QUERY
  WITH bookings_with_services AS (
    SELECT 
      COUNT(*) as service_count,
      CASE 
        WHEN b.service = 'corte-social' THEN 25.00
        WHEN b.service = 'corte-degrade' THEN 35.00
        WHEN b.service = 'corte-degrade-barba' THEN 50.00
        WHEN b.service = 'corte-degrade-pigmentacao' THEN 60.00
        WHEN b.service = 'corte-degrade-pigmentacao-barba' THEN 75.00
        WHEN b.service = 'corte-completo' THEN 90.00
        WHEN b.service = 'corte-social-pigmentacao-barba' THEN 65.00
        WHEN b.service = 'corte-degrade-sobrancelha' THEN 40.00
        WHEN b.service = 'corte-social-barba' THEN 40.00
        WHEN b.service = 'corte-infantil' THEN 20.00
        WHEN b.service = 'sobrancelha' THEN 10.00
        WHEN b.service = 'barba' THEN 15.00
        WHEN b.service = 'platinado' THEN 120.00
        WHEN b.service = 'luzes' THEN 80.00
        WHEN b.service = 'pezinho' THEN 8.00
        ELSE 25.00
      END::DECIMAL(10,2) as service_price,
      CASE 
        WHEN b.service = 'corte-social' THEN 15.00
        WHEN b.service = 'corte-degrade' THEN 22.00
        WHEN b.service = 'corte-degrade-barba' THEN 32.00
        WHEN b.service = 'corte-degrade-pigmentacao' THEN 38.00
        WHEN b.service = 'corte-degrade-pigmentacao-barba' THEN 48.00
        WHEN b.service = 'corte-completo' THEN 58.00
        WHEN b.service = 'corte-social-pigmentacao-barba' THEN 42.00
        WHEN b.service = 'corte-degrade-sobrancelha' THEN 26.00
        WHEN b.service = 'corte-social-barba' THEN 26.00
        WHEN b.service = 'corte-infantil' THEN 12.00
        WHEN b.service = 'sobrancelha' THEN 7.00
        WHEN b.service = 'barba' THEN 10.00
        WHEN b.service = 'platinado' THEN 80.00
        WHEN b.service = 'luzes' THEN 55.00
        WHEN b.service = 'pezinho' THEN 5.00
        ELSE 15.00
      END::DECIMAL(10,2) as service_profit
    FROM bookings b
    WHERE b.booking_date BETWEEN week_start_date AND week_end_date
      AND b.status = 'confirmed'
    GROUP BY b.service
  )
  SELECT 
    week_start_date,
    week_end_date,
    COALESCE(SUM(bws.service_count), 0)::INTEGER as total_services,
    COALESCE(SUM(bws.service_count * bws.service_price), 0.00)::DECIMAL(10,2) as total_revenue,
    COALESCE(SUM(bws.service_count * bws.service_profit), 0.00)::DECIMAL(10,2) as total_profit
  FROM bookings_with_services bws;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular lucros mensais
CREATE OR REPLACE FUNCTION calculate_monthly_profits(target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  month_start DATE,
  month_end DATE,
  total_services INTEGER,
  total_revenue DECIMAL(10,2),
  total_profit DECIMAL(10,2)
) AS $$
DECLARE
  month_start_date DATE;
  month_end_date DATE;
BEGIN
  month_start_date := DATE_TRUNC('month', target_date)::DATE;
  month_end_date := (DATE_TRUNC('month', target_date) + INTERVAL '1 month - 1 day')::DATE;
  
  RETURN QUERY
  WITH bookings_with_services AS (
    SELECT 
      COUNT(*) as service_count,
      CASE 
        WHEN b.service = 'corte-social' THEN 25.00
        WHEN b.service = 'corte-degrade' THEN 35.00
        WHEN b.service = 'corte-degrade-barba' THEN 50.00
        WHEN b.service = 'corte-degrade-pigmentacao' THEN 60.00
        WHEN b.service = 'corte-degrade-pigmentacao-barba' THEN 75.00
        WHEN b.service = 'corte-completo' THEN 90.00
        WHEN b.service = 'corte-social-pigmentacao-barba' THEN 65.00
        WHEN b.service = 'corte-degrade-sobrancelha' THEN 40.00
        WHEN b.service = 'corte-social-barba' THEN 40.00
        WHEN b.service = 'corte-infantil' THEN 20.00
        WHEN b.service = 'sobrancelha' THEN 10.00
        WHEN b.service = 'barba' THEN 15.00
        WHEN b.service = 'platinado' THEN 120.00
        WHEN b.service = 'luzes' THEN 80.00
        WHEN b.service = 'pezinho' THEN 8.00
        ELSE 25.00
      END::DECIMAL(10,2) as service_price,
      CASE 
        WHEN b.service = 'corte-social' THEN 15.00
        WHEN b.service = 'corte-degrade' THEN 22.00
        WHEN b.service = 'corte-degrade-barba' THEN 32.00
        WHEN b.service = 'corte-degrade-pigmentacao' THEN 38.00
        WHEN b.service = 'corte-degrade-pigmentacao-barba' THEN 48.00
        WHEN b.service = 'corte-completo' THEN 58.00
        WHEN b.service = 'corte-social-pigmentacao-barba' THEN 42.00
        WHEN b.service = 'corte-degrade-sobrancelha' THEN 26.00
        WHEN b.service = 'corte-social-barba' THEN 26.00
        WHEN b.service = 'corte-infantil' THEN 12.00
        WHEN b.service = 'sobrancelha' THEN 7.00
        WHEN b.service = 'barba' THEN 10.00
        WHEN b.service = 'platinado' THEN 80.00
        WHEN b.service = 'luzes' THEN 55.00
        WHEN b.service = 'pezinho' THEN 5.00
        ELSE 15.00
      END::DECIMAL(10,2) as service_profit
    FROM bookings b
    WHERE b.booking_date BETWEEN month_start_date AND month_end_date
      AND b.status = 'confirmed'
    GROUP BY b.service
  )
  SELECT 
    month_start_date,
    month_end_date,
    COALESCE(SUM(bws.service_count), 0)::INTEGER as total_services,
    COALESCE(SUM(bws.service_count * bws.service_price), 0.00)::DECIMAL(10,2) as total_revenue,
    COALESCE(SUM(bws.service_count * bws.service_profit), 0.00)::DECIMAL(10,2) as total_profit
  FROM bookings_with_services bws;
END;
$$ LANGUAGE plpgsql;