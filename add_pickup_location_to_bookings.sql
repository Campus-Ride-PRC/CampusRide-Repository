-- Add latitude and longitude columns to addresses table
ALTER TABLE addresses
ADD COLUMN latitude DOUBLE PRECISION,
ADD COLUMN longitude DOUBLE PRECISION;

-- Add pickup address foreign key to bookings table
ALTER TABLE bookings
ADD COLUMN pickup_address_id BIGINT,
ADD CONSTRAINT fk_bookings_pickup_address FOREIGN KEY (pickup_address_id) REFERENCES addresses(id);
