-- Create service_profits table to store profit data for each service
CREATE TABLE service_profits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id VARCHAR(100) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  profit_margin DECIMAL(5,2) DEFAULT 70.00, -- 70% profit margin by default
  profit_amount DECIMAL(10,2) GENERATED ALWAYS AS (base_price * profit_margin / 100) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert profit data for each service
INSERT INTO service_profits (service_id, service_name, base_price) VALUES
('corte-social', 'Corte Social', 24.90),
('corte-degrade', 'Corte Degradê', 24.90),
('corte-degrade-barba', 'Corte Degradê + Barba', 35.00),
('corte-degrade-pigmentacao', 'Corte Degradê + Pigmentação', 35.00),
('corte-degrade-pigmentacao-barba', 'Corte Degradê + Pigmentação + Barba', 45.00),
('corte-completo', 'Corte Degradê + Pigmentação + Barba + Sobrancelha', 50.00),
('corte-social-pigmentacao-barba', 'Corte Social + Pigmentação + Barba', 40.00),
('corte-degrade-sobrancelha', 'Corte Degradê + Sobrancelha', 30.00),
('corte-social-barba', 'Corte Social + Barba', 30.00),
('corte-infantil', 'Corte Infantil', 30.00),
('sobrancelha', 'Sobrancelha', 5.00),
('barba', 'Barba', 10.00),
('platinado', 'Platinado', 100.00),
('luzes', 'Luzes', 80.00),
('pezinho', 'Pezinho', 5.00);

-- Create index for efficient querying
CREATE INDEX idx_service_profits_service_id ON service_profits(service_id);

-- Enable Row Level Security
ALTER TABLE service_profits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON service_profits
  FOR SELECT USING (true);

-- Update bookings table to include completion status and profit tracking
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS profit_amount DECIMAL(10,2);

-- Create function to calculate daily profits
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
      AND completed_at IS NOT NULL
    GROUP BY service
  ) service_counts ON b.service = service_counts.service
  WHERE b.booking_date = target_date 
    AND b.status = 'confirmed'
    AND b.completed_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate weekly profits
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
    AND b.status = 'confirmed'
    AND b.completed_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate monthly profits
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
    AND b.status = 'confirmed'
    AND b.completed_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;