-- Revert to working profit calculation functions
-- Remove all broken functions first
DROP FUNCTION IF EXISTS calculate_daily_profits(DATE);
DROP FUNCTION IF EXISTS calculate_weekly_profits(DATE);
DROP FUNCTION IF EXISTS calculate_monthly_profits(DATE);
DROP FUNCTION IF EXISTS get_service_profit_info(TEXT);

-- Create a simple working version of daily profits
CREATE OR REPLACE FUNCTION calculate_daily_profits(target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  total_services INTEGER,
  total_revenue DECIMAL(10,2),
  total_profit DECIMAL(10,2),
  services_breakdown JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH service_counts AS (
    SELECT 
      service,
      COUNT(*) as service_count
    FROM bookings 
    WHERE booking_date = target_date 
      AND status = 'confirmed'
    GROUP BY service
  ),
  service_profits AS (
    SELECT 
      sc.service,
      sc.service_count,
      CASE sc.service
        WHEN 'corte-social' THEN 25.00::DECIMAL(10,2)
        WHEN 'corte-degrade' THEN 35.00::DECIMAL(10,2)
        WHEN 'corte-degrade-barba' THEN 50.00::DECIMAL(10,2)
        WHEN 'corte-degrade-pigmentacao' THEN 60.00::DECIMAL(10,2)
        WHEN 'corte-degrade-pigmentacao-barba' THEN 75.00::DECIMAL(10,2)
        WHEN 'corte-completo' THEN 90.00::DECIMAL(10,2)
        WHEN 'corte-social-pigmentacao-barba' THEN 65.00::DECIMAL(10,2)
        WHEN 'corte-degrade-sobrancelha' THEN 40.00::DECIMAL(10,2)
        WHEN 'corte-social-barba' THEN 40.00::DECIMAL(10,2)
        WHEN 'corte-infantil' THEN 20.00::DECIMAL(10,2)
        WHEN 'sobrancelha' THEN 10.00::DECIMAL(10,2)
        WHEN 'barba' THEN 15.00::DECIMAL(10,2)
        WHEN 'platinado' THEN 120.00::DECIMAL(10,2)
        WHEN 'luzes' THEN 80.00::DECIMAL(10,2)
        WHEN 'pezinho' THEN 8.00::DECIMAL(10,2)
        ELSE 25.00::DECIMAL(10,2)
      END as base_price,
      CASE sc.service
        WHEN 'corte-social' THEN 15.00::DECIMAL(10,2)
        WHEN 'corte-degrade' THEN 22.00::DECIMAL(10,2)
        WHEN 'corte-degrade-barba' THEN 32.00::DECIMAL(10,2)
        WHEN 'corte-degrade-pigmentacao' THEN 38.00::DECIMAL(10,2)
        WHEN 'corte-degrade-pigmentacao-barba' THEN 48.00::DECIMAL(10,2)
        WHEN 'corte-completo' THEN 58.00::DECIMAL(10,2)
        WHEN 'corte-social-pigmentacao-barba' THEN 42.00::DECIMAL(10,2)
        WHEN 'corte-degrade-sobrancelha' THEN 26.00::DECIMAL(10,2)
        WHEN 'corte-social-barba' THEN 26.00::DECIMAL(10,2)
        WHEN 'corte-infantil' THEN 12.00::DECIMAL(10,2)
        WHEN 'sobrancelha' THEN 7.00::DECIMAL(10,2)
        WHEN 'barba' THEN 10.00::DECIMAL(10,2)
        WHEN 'platinado' THEN 80.00::DECIMAL(10,2)
        WHEN 'luzes' THEN 55.00::DECIMAL(10,2)
        WHEN 'pezinho' THEN 5.00::DECIMAL(10,2)
        ELSE 15.00::DECIMAL(10,2)
      END as profit_amount
    FROM service_counts sc
  )
  SELECT 
    COALESCE(SUM(sp.service_count), 0)::INTEGER as total_services,
    COALESCE(SUM(sp.service_count * sp.base_price), 0.00)::DECIMAL(10,2) as total_revenue,
    COALESCE(SUM(sp.service_count * sp.profit_amount), 0.00)::DECIMAL(10,2) as total_profit,
    COALESCE(jsonb_agg(
      jsonb_build_object(
        'service', sp.service,
        'count', sp.service_count,
        'revenue', sp.service_count * sp.base_price,
        'profit', sp.service_count * sp.profit_amount
      )
    ), '[]'::jsonb) as services_breakdown
  FROM service_profits sp;
END;
$$ LANGUAGE plpgsql;

-- Create weekly profits function
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
  -- Calculate week boundaries (Monday to Sunday)
  week_start_date := target_date - (EXTRACT(DOW FROM target_date)::INTEGER - 1);
  week_end_date := week_start_date + 6;
  
  RETURN QUERY
  WITH service_counts AS (
    SELECT 
      service,
      COUNT(*) as service_count
    FROM bookings 
    WHERE booking_date BETWEEN week_start_date AND week_end_date
      AND status = 'confirmed'
    GROUP BY service
  ),
  service_profits AS (
    SELECT 
      sc.service_count,
      CASE sc.service
        WHEN 'corte-social' THEN 25.00::DECIMAL(10,2)
        WHEN 'corte-degrade' THEN 35.00::DECIMAL(10,2)
        WHEN 'corte-degrade-barba' THEN 50.00::DECIMAL(10,2)
        WHEN 'corte-degrade-pigmentacao' THEN 60.00::DECIMAL(10,2)
        WHEN 'corte-degrade-pigmentacao-barba' THEN 75.00::DECIMAL(10,2)
        WHEN 'corte-completo' THEN 90.00::DECIMAL(10,2)
        WHEN 'corte-social-pigmentacao-barba' THEN 65.00::DECIMAL(10,2)
        WHEN 'corte-degrade-sobrancelha' THEN 40.00::DECIMAL(10,2)
        WHEN 'corte-social-barba' THEN 40.00::DECIMAL(10,2)
        WHEN 'corte-infantil' THEN 20.00::DECIMAL(10,2)
        WHEN 'sobrancelha' THEN 10.00::DECIMAL(10,2)
        WHEN 'barba' THEN 15.00::DECIMAL(10,2)
        WHEN 'platinado' THEN 120.00::DECIMAL(10,2)
        WHEN 'luzes' THEN 80.00::DECIMAL(10,2)
        WHEN 'pezinho' THEN 8.00::DECIMAL(10,2)
        ELSE 25.00::DECIMAL(10,2)
      END as base_price,
      CASE sc.service
        WHEN 'corte-social' THEN 15.00::DECIMAL(10,2)
        WHEN 'corte-degrade' THEN 22.00::DECIMAL(10,2)
        WHEN 'corte-degrade-barba' THEN 32.00::DECIMAL(10,2)
        WHEN 'corte-degrade-pigmentacao' THEN 38.00::DECIMAL(10,2)
        WHEN 'corte-degrade-pigmentacao-barba' THEN 48.00::DECIMAL(10,2)
        WHEN 'corte-completo' THEN 58.00::DECIMAL(10,2)
        WHEN 'corte-social-pigmentacao-barba' THEN 42.00::DECIMAL(10,2)
        WHEN 'corte-degrade-sobrancelha' THEN 26.00::DECIMAL(10,2)
        WHEN 'corte-social-barba' THEN 26.00::DECIMAL(10,2)
        WHEN 'corte-infantil' THEN 12.00::DECIMAL(10,2)
        WHEN 'sobrancelha' THEN 7.00::DECIMAL(10,2)
        WHEN 'barba' THEN 10.00::DECIMAL(10,2)
        WHEN 'platinado' THEN 80.00::DECIMAL(10,2)
        WHEN 'luzes' THEN 55.00::DECIMAL(10,2)
        WHEN 'pezinho' THEN 5.00::DECIMAL(10,2)
        ELSE 15.00::DECIMAL(10,2)
      END as profit_amount
    FROM service_counts sc
  )
  SELECT 
    week_start_date,
    week_end_date,
    COALESCE(SUM(sp.service_count), 0)::INTEGER as total_services,
    COALESCE(SUM(sp.service_count * sp.base_price), 0.00)::DECIMAL(10,2) as total_revenue,
    COALESCE(SUM(sp.service_count * sp.profit_amount), 0.00)::DECIMAL(10,2) as total_profit
  FROM service_profits sp;
END;
$$ LANGUAGE plpgsql;

-- Create monthly profits function
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
  WITH service_counts AS (
    SELECT 
      service,
      COUNT(*) as service_count
    FROM bookings 
    WHERE booking_date BETWEEN month_start_date AND month_end_date
      AND status = 'confirmed'
    GROUP BY service
  ),
  service_profits AS (
    SELECT 
      sc.service_count,
      CASE sc.service
        WHEN 'corte-social' THEN 25.00::DECIMAL(10,2)
        WHEN 'corte-degrade' THEN 35.00::DECIMAL(10,2)
        WHEN 'corte-degrade-barba' THEN 50.00::DECIMAL(10,2)
        WHEN 'corte-degrade-pigmentacao' THEN 60.00::DECIMAL(10,2)
        WHEN 'corte-degrade-pigmentacao-barba' THEN 75.00::DECIMAL(10,2)
        WHEN 'corte-completo' THEN 90.00::DECIMAL(10,2)
        WHEN 'corte-social-pigmentacao-barba' THEN 65.00::DECIMAL(10,2)
        WHEN 'corte-degrade-sobrancelha' THEN 40.00::DECIMAL(10,2)
        WHEN 'corte-social-barba' THEN 40.00::DECIMAL(10,2)
        WHEN 'corte-infantil' THEN 20.00::DECIMAL(10,2)
        WHEN 'sobrancelha' THEN 10.00::DECIMAL(10,2)
        WHEN 'barba' THEN 15.00::DECIMAL(10,2)
        WHEN 'platinado' THEN 120.00::DECIMAL(10,2)
        WHEN 'luzes' THEN 80.00::DECIMAL(10,2)
        WHEN 'pezinho' THEN 8.00::DECIMAL(10,2)
        ELSE 25.00::DECIMAL(10,2)
      END as base_price,
      CASE sc.service
        WHEN 'corte-social' THEN 15.00::DECIMAL(10,2)
        WHEN 'corte-degrade' THEN 22.00::DECIMAL(10,2)
        WHEN 'corte-degrade-barba' THEN 32.00::DECIMAL(10,2)
        WHEN 'corte-degrade-pigmentacao' THEN 38.00::DECIMAL(10,2)
        WHEN 'corte-degrade-pigmentacao-barba' THEN 48.00::DECIMAL(10,2)
        WHEN 'corte-completo' THEN 58.00::DECIMAL(10,2)
        WHEN 'corte-social-pigmentacao-barba' THEN 42.00::DECIMAL(10,2)
        WHEN 'corte-degrade-sobrancelha' THEN 26.00::DECIMAL(10,2)
        WHEN 'corte-social-barba' THEN 26.00::DECIMAL(10,2)
        WHEN 'corte-infantil' THEN 12.00::DECIMAL(10,2)
        WHEN 'sobrancelha' THEN 7.00::DECIMAL(10,2)
        WHEN 'barba' THEN 10.00::DECIMAL(10,2)
        WHEN 'platinado' THEN 80.00::DECIMAL(10,2)
        WHEN 'luzes' THEN 55.00::DECIMAL(10,2)
        WHEN 'pezinho' THEN 5.00::DECIMAL(10,2)
        ELSE 15.00::DECIMAL(10,2)
      END as profit_amount
    FROM service_counts sc
  )
  SELECT 
    month_start_date,
    month_end_date,
    COALESCE(SUM(sp.service_count), 0)::INTEGER as total_services,
    COALESCE(SUM(sp.service_count * sp.base_price), 0.00)::DECIMAL(10,2) as total_revenue,
    COALESCE(SUM(sp.service_count * sp.profit_amount), 0.00)::DECIMAL(10,2) as total_profit
  FROM service_profits sp;
END;
$$ LANGUAGE plpgsql;
