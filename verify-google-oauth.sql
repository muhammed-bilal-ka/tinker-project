-- Google OAuth Verification Script
-- This helps verify your Google OAuth setup

-- 1. Check if OAuth trigger is working
SELECT 'OAuth Setup Verification:' as info;
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_oauth_user_created';

-- 2. Check user_profiles table structure
SELECT 'User profiles table check:' as info;
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 3. Show recent auth users (if any)
SELECT 'Recent auth users:' as info;
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data->>'provider' as provider,
  raw_user_meta_data->>'full_name' as full_name
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Check if any OAuth users have profiles
SELECT 'OAuth users with profiles:' as info;
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'provider' as provider,
  up.full_name,
  up.created_at as profile_created
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
WHERE u.raw_user_meta_data->>'provider' IS NOT NULL
ORDER BY u.created_at DESC;

-- 5. Google OAuth Configuration Checklist
SELECT 'Google OAuth Configuration Checklist:' as info;
SELECT 
  '1. Google Cloud Console OAuth 2.0 Client ID created' as step1,
  '2. Authorized redirect URI added: https://ipbjhrdcpotxxjgnserz.supabase.co/auth/v1/callback' as step2,
  '3. Supabase Google provider enabled' as step3,
  '4. Google Client ID and Secret entered in Supabase' as step4,
  '5. Site URL configured in Supabase Auth Settings' as step5;

-- 6. Common redirect URIs to add in Google Console
SELECT 'Required Redirect URIs for Google Console:' as info;
SELECT 
  'https://ipbjhrdcpotxxjgnserz.supabase.co/auth/v1/callback' as production_uri,
  'http://localhost:5173/auth/callback' as dev_uri_1,
  'http://localhost:3000/auth/callback' as dev_uri_2;

-- 7. Test OAuth function
SELECT 'Testing OAuth handler function:' as info;
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_oauth_user'; 