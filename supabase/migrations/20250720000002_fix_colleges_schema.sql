/*
  # Fix Colleges Schema - Add Missing Columns

  This migration adds the missing columns to the colleges table:
  - admission_info (jsonb) - Admission requirements and process
  - contact_info (jsonb) - Contact information structure

  This fixes the schema cache error when updating colleges.
*/

-- Add missing columns to colleges table
ALTER TABLE public.colleges 
ADD COLUMN IF NOT EXISTS admission_info jsonb DEFAULT '{"requirements": "Standard admission requirements apply", "process": "Merit-based admission process", "fees": "Contact college for details"}'::jsonb,
ADD COLUMN IF NOT EXISTS contact_info jsonb DEFAULT '{"phone": "", "email": "", "website": ""}'::jsonb;

-- Update existing records to have proper structure
UPDATE public.colleges 
SET 
  admission_info = jsonb_build_object(
    'requirements', 'Standard admission requirements apply',
    'process', 'Merit-based admission process',
    'fees', COALESCE(fees_range, 'Contact college for details')
  ),
  contact_info = jsonb_build_object(
    'phone', COALESCE(contact_phone, ''),
    'email', COALESCE(contact_email, ''),
    'website', COALESCE(website, '')
  )
WHERE admission_info IS NULL OR contact_info IS NULL;

-- Add constraints to ensure data integrity
ALTER TABLE public.colleges 
ALTER COLUMN admission_info SET NOT NULL,
ALTER COLUMN contact_info SET NOT NULL;

-- Create indexes for better performance on JSONB columns
CREATE INDEX IF NOT EXISTS idx_colleges_admission_info ON public.colleges USING GIN (admission_info);
CREATE INDEX IF NOT EXISTS idx_colleges_contact_info ON public.colleges USING GIN (contact_info);

-- Update the updated_at trigger to handle the new columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS update_colleges_updated_at ON public.colleges;
CREATE TRIGGER update_colleges_updated_at 
    BEFORE UPDATE ON public.colleges 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON COLUMN public.colleges.admission_info IS 'JSON object containing admission requirements, process, and fees information';
COMMENT ON COLUMN public.colleges.contact_info IS 'JSON object containing phone, email, and website contact information'; 