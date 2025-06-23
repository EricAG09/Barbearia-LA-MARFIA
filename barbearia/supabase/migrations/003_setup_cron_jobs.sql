-- Install pg_cron extension if not already installed
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily profit report to run every day at 8 PM (20:00)
-- This will call the Edge Function to send WhatsApp messages
SELECT cron.schedule(
  'daily-profit-report',
  '0 20 * * *', -- Every day at 8 PM
  $$
  SELECT 
    net.http_post(
      url := 'https://your-project-id.supabase.co/functions/v1/daily-profit-report',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb,
      body := '{}'::jsonb
    );
  $$
);

-- Note: You'll need to replace 'your-project-id' with your actual Supabase project ID
-- and configure the service_role_key in your Supabase settings

-- Create a function to manually trigger the report (for testing)
CREATE OR REPLACE FUNCTION trigger_daily_report()
RETURNS void AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://your-project-id.supabase.co/functions/v1/daily-profit-report',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
END;
$$ LANGUAGE plpgsql;