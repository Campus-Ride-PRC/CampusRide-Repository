-- Add CANCELED status to bookings_status_check constraint
-- This script updates the check constraint to allow CANCELED status

-- First, drop the existing constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Recreate the constraint with CANCELED included
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
    CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELED', 'DONE'));

-- Verify the constraint was created
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'bookings_status_check';
