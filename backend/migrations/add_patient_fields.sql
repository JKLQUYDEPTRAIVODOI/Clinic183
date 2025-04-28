-- Add missing columns to patients table if they don't exist
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS medical_history TEXT,
ADD COLUMN IF NOT EXISTS allergies TEXT,
ADD COLUMN IF NOT EXISTS current_medications TEXT; 