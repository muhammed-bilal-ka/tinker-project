-- Simple Google OAuth Setup for Supabase
-- This script sets up the database side of Google OAuth

-- 1. Verify user_profiles table exists
SELECT 'Checking user_profiles table:' as info;
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
) as table_exists;

-- 2. Create function to handle OAuth user profile creation
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
    
    RAISE NOTICE 'Created user profile for OAuth user: %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger to automatically create user profile on OAuth signup
DROP TRIGGER IF EXISTS on_oauth_user_created ON auth.users;
CREATE TRIGGER on_oauth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_oauth_user();

-- 4. Test the function (optional)
SELECT 'OAuth user handler function created successfully' as status;

-- 5. Verify the trigger was created
SELECT 'Verifying trigger creation:' as info;
SELECT 
  trigger_name,
  event_manipulation,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_oauth_user_created';

-- 6. Show setup instructions
SELECT 'Google OAuth Setup Instructions:' as info;
SELECT 
  '1. Go to Supabase Dashboard > Authentication > Providers' as step1,
  '2. Enable Google provider' as step2,
  '3. Enter your Google Client ID and Client Secret' as step3,
  '4. Set redirect URLs in Authentication > Settings' as step4,
  '5. Test Google login in your app' as step5;

-- 7. Check user_profiles table structure
SELECT 'User profiles table structure:' as info;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles'
ORDER BY ordinal_position; 