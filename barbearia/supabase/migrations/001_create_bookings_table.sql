- Create bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  service VARCHAR(100) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient querying
CREATE INDEX idx_bookings_date_time ON bookings(booking_date, booking_time);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read and insert
CREATE POLICY "Allow public read access" ON bookings
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON bookings
  FOR INSERT WITH CHECK (true);
