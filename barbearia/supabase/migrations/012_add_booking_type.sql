
-- Adicionar coluna booking_type à tabela bookings
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS booking_type VARCHAR(20) DEFAULT 'scheduled' CHECK (booking_type IN ('scheduled', 'walk_in'));

-- Atualizar registros existentes para ter booking_type 'scheduled'
UPDATE bookings 
SET booking_type = 'scheduled' 
WHERE booking_type IS NULL;

-- Comentário sobre os tipos:
-- 'scheduled': Agendamento com horário marcado
-- 'walk_in': Agendamento por ordem de chegada