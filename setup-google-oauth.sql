-- Google OAuth Setup for Supabase
-- This script helps configure Google OAuth authentication

-- 1. Check current auth configuration
SELECT 'Current auth configuration:' as info;
SELECT 
  'Google OAuth configuration is managed via Supabase Dashboard' as note,
  'Go to Authentication > Providers > Google to configure' as instruction;

-- 2. Enable Google provider (this is typically done via Supabase Dashboard)
-- Go to Authentication > Providers > Google and enable it
-- Enter your Google Client ID and Client Secret

-- 3. Set up proper redirect URLs
-- In Supabase Dashboard > Authentication > Settings:
-- Site URL: http://localhost:5173 (for development)
-- Redirect URLs: 
--   http://localhost:5173/complete-profile
--   http://localhost:5173/auth/callback
--   https://yourdomain.com/complete-profile (for production)

-- 4. Create function to handle OAuth user profile creation
CREATE OR REPLACE FUNCTION handle_oauth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user profile already exists
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = NEW.id
  ) THEN
    -- Create basic profile from OAuth data
    INSERT INTO public.user_profiles (
      user_id,
      full_name,
      phone,
      city,
      pincode,
      profession,
      qualification,
      consent
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Unknown User'),
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE(NEW.raw_user_meta_data->>'city', ''),
      COALESCE(NEW.raw_user_meta_data->>'pincode', ''),
      COALESCE(NEW.raw_user_meta_data->>'profession', 'Student'),
      COALESCE(NEW.raw_user_meta_data->>'qualification', 'High School'),
      true
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger to automatically create user profile on OAuth signup
DROP TRIGGER IF EXISTS on_oauth_user_created ON auth.users;
CREATE TRIGGER on_oauth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_oauth_user();

-- 6. Test the setup
SELECT 'OAuth setup verification:' as info;
SELECT 
  'Google OAuth should be configured via Supabase Dashboard' as setup_status,
  'Check Authentication > Providers > Google' as next_step;

-- 7. Verify user profiles table structure
SELECT 'User profiles table structure:' as info;
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles'
ORDER BY ordinal_position; 