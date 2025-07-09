-- Remover todas as funções existentes que podem estar causando conflito
DROP FUNCTION IF EXISTS calculate_daily_profits(DATE);
DROP FUNCTION IF EXISTS calculate_weekly_profits(DATE);
DROP FUNCTION IF EXISTS calculate_monthly_profits(DATE);
DROP FUNCTION IF EXISTS get_service_profit_info(TEXT);

-- Função para calcular lucros diários com detalhamento por serviço
CREATE OR REPLACE FUNCTION calculate_daily_profits(target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  total_services INTEGER,
  total_revenue DECIMAL(10,2),
  total_profit DECIMAL(10,2),
  services_breakdown JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH service_stats AS (
    SELECT 
      b.service,
      COUNT(*) as service_count,
      CASE 
        WHEN b.service LIKE '%corte-social%' THEN 24.90
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%pigmentacao%' AND b.service LIKE '%barba%' THEN 49.90
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%pigmentacao%' THEN 44.90
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%barba%' THEN 44.00
        WHEN b.service LIKE '%corte-degrade%' THEN 24.90
        WHEN b.service LIKE '%corte-infantil%' THEN 30.00
        WHEN b.service LIKE '%sobrancelha%' THEN 5.00
        WHEN b.service LIKE '%barba%' THEN 14.00
        ELSE 24.90
      END::DECIMAL(10,2) as price,
      CASE 
        WHEN b.service LIKE '%corte-social%' THEN 15.00
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%pigmentacao%' AND b.service LIKE '%barba%' THEN 30.00
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%pigmentacao%' THEN 27.00
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%barba%' THEN 26.00
        WHEN b.service LIKE '%corte-degrade%' THEN 15.00
        WHEN b.service LIKE '%corte-infantil%' THEN 18.00
        WHEN b.service LIKE '%sobrancelha%' THEN 3.00
        WHEN b.service LIKE '%barba%' THEN 8.00
        ELSE 15.00
      END::DECIMAL(10,2) as profit
    FROM bookings b
    WHERE b.booking_date = target_date 
      AND b.status = 'confirmed'
    GROUP BY b.service
  )
  SELECT 
    COALESCE(SUM(ss.service_count), 0)::INTEGER,
    COALESCE(SUM(ss.service_count * ss.price), 0.00)::DECIMAL(10,2),
    COALESCE(SUM(ss.service_count * ss.profit), 0.00)::DECIMAL(10,2),
    CASE 
      WHEN COUNT(ss.service) > 0 THEN
        jsonb_agg(
          jsonb_build_object(
            'service', ss.service,
            'count', ss.service_count,
            'revenue', ss.service_count * ss.price,
            'profit', ss.service_count * ss.profit
          )
        )
      ELSE '[]'::jsonb
    END
  FROM service_stats ss;
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
  SELECT 
    week_start_date,
    week_end_date,
    COALESCE(COUNT(b.id), 0)::INTEGER,
    COALESCE(SUM(
      CASE 
        WHEN b.service LIKE '%corte-social%' THEN 24.90
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%pigmentacao%' AND b.service LIKE '%barba%' THEN 49.90
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%pigmentacao%' THEN 44.90
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%barba%' THEN 44.00
        WHEN b.service LIKE '%corte-degrade%' THEN 24.90
        WHEN b.service LIKE '%corte-infantil%' THEN 30.00
        WHEN b.service LIKE '%sobrancelha%' THEN 5.00
        WHEN b.service LIKE '%barba%' THEN 14.00
        ELSE 24.90
      END
    ), 0)::DECIMAL(10,2),
    COALESCE(SUM(
      CASE 
        WHEN b.service LIKE '%corte-social%' THEN 15.00
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%pigmentacao%' AND b.service LIKE '%barba%' THEN 30.00
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%pigmentacao%' THEN 27.00
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%barba%' THEN 26.00
        WHEN b.service LIKE '%corte-degrade%' THEN 15.00
        WHEN b.service LIKE '%corte-infantil%' THEN 18.00
        WHEN b.service LIKE '%sobrancelha%' THEN 3.00
        WHEN b.service LIKE '%barba%' THEN 8.00
        ELSE 15.00
      END
    ), 0)::DECIMAL(10,2)
  FROM bookings b
  WHERE b.booking_date BETWEEN week_start_date AND week_end_date
    AND b.status = 'confirmed';
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
  SELECT 
    month_start_date,
    month_end_date,
    COALESCE(COUNT(b.id), 0)::INTEGER,
    COALESCE(SUM(
      CASE 
        WHEN b.service LIKE '%corte-social%' THEN 24.90
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%pigmentacao%' AND b.service LIKE '%barba%' THEN 49.90
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%pigmentacao%' THEN 44.90
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%barba%' THEN 44.00
        WHEN b.service LIKE '%corte-degrade%' THEN 24.90
        WHEN b.service LIKE '%corte-infantil%' THEN 30.00
        WHEN b.service LIKE '%sobrancelha%' THEN 5.00
        WHEN b.service LIKE '%barba%' THEN 14.00
        ELSE 24.90
      END
    ), 0)::DECIMAL(10,2),
    COALESCE(SUM(
      CASE 
        WHEN b.service LIKE '%corte-social%' THEN 15.00
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%pigmentacao%' AND b.service LIKE '%barba%' THEN 30.00
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%pigmentacao%' THEN 27.00
        WHEN b.service LIKE '%corte-degrade%' AND b.service LIKE '%barba%' THEN 26.00
        WHEN b.service LIKE '%corte-degrade%' THEN 15.00
        WHEN b.service LIKE '%corte-infantil%' THEN 18.00
        WHEN b.service LIKE '%sobrancelha%' THEN 3.00
        WHEN b.service LIKE '%barba%' THEN 8.00
        ELSE 15.00
      END
    ), 0)::DECIMAL(10,2)
  FROM bookings b
  WHERE b.booking_date BETWEEN month_start_date AND month_end_date
    AND b.status = 'confirmed';
END;
$$ LANGUAGE plpgsql;