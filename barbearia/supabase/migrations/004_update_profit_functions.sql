-- Update the profit calculation functions to include confirmed bookings
-- not just completed ones, since we want to track profits immediately when booking is confirmed

CREATE OR REPLACE FUNCTION calculate_daily_profits(target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  total_services INTEGER,
  total_revenue DECIMAL(10,2),
  total_profit DECIMAL(10,2),
  services_breakdown JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(b.id)::INTEGER as total_services,
    COALESCE(SUM(sp.base_price), 0) as total_revenue,
    COALESCE(SUM(sp.profit_amount), 0) as total_profit,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'service', sp.service_name,
          'count', service_counts.count,
          'revenue', service_counts.count * sp.base_price,
          'profit', service_counts.count * sp.profit_amount
        )
      ), 
      '[]'::jsonb
    ) as services_breakdown
  FROM bookings b
  JOIN service_profits sp ON b.service = sp.service_id
  JOIN (
    SELECT 
      service,
      COUNT(*) as count
    FROM bookings 
    WHERE booking_date = target_date 
      AND status = 'confirmed'
    GROUP BY service
  ) service_counts ON b.service = service_counts.service
  WHERE b.booking_date = target_date 
    AND b.status = 'confirmed';
END;
$$ LANGUAGE plpgsql;

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
  -- Calculate the start and end of the week (Monday to Sunday)
  week_start_date := target_date - (EXTRACT(DOW FROM target_date)::INTEGER - 1);
  week_end_date := week_start_date + 6;
  
  RETURN QUERY
  SELECT 
    week_start_date,
    week_end_date,
    COUNT(b.id)::INTEGER as total_services,
    COALESCE(SUM(sp.base_price), 0) as total_revenue,
    COALESCE(SUM(sp.profit_amount), 0) as total_profit
  FROM bookings b
  JOIN service_profits sp ON b.service = sp.service_id
  WHERE b.booking_date BETWEEN week_start_date AND week_end_date
    AND b.status = 'confirmed';
END;
$$ LANGUAGE plpgsql;

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
    COUNT(b.id)::INTEGER as total_services,
    COALESCE(SUM(sp.base_price), 0) as total_revenue,
    COALESCE(SUM(sp.profit_amount), 0) as total_profit
  FROM bookings b
  JOIN service_profits sp ON b.service = sp.service_id
  WHERE b.booking_date BETWEEN month_start_date AND month_end_date
    AND b.status = 'confirmed';
END;
$$ LANGUAGE plpgsql;