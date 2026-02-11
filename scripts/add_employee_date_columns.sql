-- SQL script to add dob and doj columns to the employees table
ALTER TABLE employees ADD COLUMN IF NOT EXISTS dob DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS doj DATE;

-- Verify the columns
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'employees';
