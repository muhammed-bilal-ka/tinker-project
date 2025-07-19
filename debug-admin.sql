-- Debug Admin Access Issues
-- Run these queries in your Supabase SQL Editor to troubleshoot

-- 1. Check if admin_roles table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'admin_roles'
) as table_exists;

-- 2. Check all admin roles in the database
SELECT 
  ar.id,
  ar.user_id,
  ar.role,
  ar.permissions,
  ar.is_active,
  ar.created_at,
  u.email as user_email
FROM public.admin_roles ar
LEFT JOIN auth.users u ON ar.user_id = u.id
ORDER BY ar.created_at DESC;

-- 3. Check if your specific user has an admin role
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID
SELECT 
  ar.id,
  ar.user_id,
  ar.role,
  ar.permissions,
  ar.is_active,
  ar.created_at,
  u.email as user_email
FROM public.admin_roles ar
LEFT JOIN auth.users u ON ar.user_id = u.id
WHERE ar.user_id = 'YOUR_USER_ID_HERE';

-- 4. Check all users in auth.users table
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- 5. Check RLS policies on admin_roles table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'admin_roles';

-- 6. Test the is_admin function
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID
SELECT is_admin('YOUR_USER_ID_HERE') as is_admin_result;

-- 7. Test the is_super_admin function
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID
SELECT is_super_admin('YOUR_USER_ID_HERE') as is_super_admin_result;

-- 8. Check if there are any errors in the admin_roles table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'admin_roles'
ORDER BY ordinal_position; 