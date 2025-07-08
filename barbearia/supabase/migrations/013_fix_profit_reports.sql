-- Corrigir definitivamente as funções de cálculo de lucro
-- Remover todas as funções existentes e recriar com lógica simplificada

DROP FUNCTION IF EXISTS calculate_daily_profits(DATE);
DROP FUNCTION IF EXISTS calculate_weekly_profits(DATE);
DROP FUNCTION IF EXISTS calculate_monthly_profits(DATE);
DROP FUNCTION IF EXISTS get_service_profit_info(TEXT);

-- Função simplificada para calcular lucros diários
CREATE OR REPLACE FUNCTION calculate_daily_profits(target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  total_services INTEGER,
  total_revenue DECIMAL(10,2),
  total_profit DECIMAL(10,2),
  services_breakdown JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH service_calculations AS (
    SELECT 
      b.service,
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
      END::DECIMAL(10,2) as price,
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
      END::DECIMAL(10,2) as profit
    FROM bookings b
    WHERE b.booking_date = target_date 
      AND b.status = 'confirmed'
    GROUP BY b.service
  )
  SELECT 
    COALESCE(SUM(sc.service_count), 0)::INTEGER,
    COALESCE(SUM(sc.service_count * sc.price), 0.00)::DECIMAL(10,2),
    COALESCE(SUM(sc.service_count * sc.profit), 0.00)::DECIMAL(10,2),
    CASE 
      WHEN COUNT(*) > 0 THEN
        jsonb_agg(
          jsonb_build_object(
            'service', sc.service,
            'count', sc.service_count,
            'revenue', sc.service_count * sc.price,
            'profit', sc.service_count * sc.profit
          )
        )
      ELSE '[]'::jsonb
    END
  FROM service_calculations sc;
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
  -- Calcular início e fim da semana
  week_start_date := target_date - (EXTRACT(DOW FROM target_date)::INTEGER - 1);
  week_end_date := week_start_date + 6;
  
  RETURN QUERY
  WITH service_calculations AS (
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
      END::DECIMAL(10,2) as price,
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
      END::DECIMAL(10,2) as profit
    FROM bookings b
    WHERE b.booking_date BETWEEN week_start_date AND week_end_date
      AND b.status = 'confirmed'
    GROUP BY b.service
  )
  SELECT 
    week_start_date,
    week_end_date,
    COALESCE(SUM(sc.service_count), 0)::INTEGER,
    COALESCE(SUM(sc.service_count * sc.price), 0.00)::DECIMAL(10,2),
    COALESCE(SUM(sc.service_count * sc.profit), 0.00)::DECIMAL(10,2)
  FROM service_calculations sc;
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
  WITH service_calculations AS (
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
      END::DECIMAL(10,2) as price,
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
      END::DECIMAL(10,2) as profit
    FROM bookings b
    WHERE b.booking_date BETWEEN month_start_date AND month_end_date
      AND b.status = 'confirmed'
    GROUP BY b.service
  )
  SELECT 
    month_start_date,
    month_end_date,
    COALESCE(SUM(sc.service_count), 0)::INTEGER,
    COALESCE(SUM(sc.service_count * sc.price), 0.00)::DECIMAL(10,2),
    COALESCE(SUM(sc.service_count * sc.profit), 0.00)::DECIMAL(10,2)
  FROM service_calculations sc;
END;
$$ LANGUAGE plpgsql;