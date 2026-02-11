-- SQL script to add email and mobile columns to the employees table
ALTER TABLE employees ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS mobile TEXT;

-- Verify the columns
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'employees';
