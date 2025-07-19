-- Simple test to check if admin role exists
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from the profile page

-- 1. Check if admin_roles table exists
SELECT 'admin_roles table exists' as status, COUNT(*) as count 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'admin_roles';

-- 2. Check if your user has an admin role
SELECT 
  'admin role check' as status,
  ar.user_id,
  ar.role,
  ar.is_active,
  u.email
FROM public.admin_roles ar
LEFT JOIN auth.users u ON ar.user_id = u.id
WHERE ar.user_id = 'YOUR_USER_ID_HERE';

-- 3. If no results above, check all users to find yours
SELECT 
  'all users' as status,
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 4. If you found your user ID, insert admin role
-- Uncomment and run this if step 2 returned no results:
/*
INSERT INTO public.admin_roles (user_id, role, permissions, is_active) 
VALUES (
  'YOUR_ACTUAL_USER_ID_HERE', 
  'super_admin', 
  '["manage_colleges", "manage_events", "manage_keam_data", "manage_users", "manage_reviews"]'::jsonb,
  true
);
*/ 