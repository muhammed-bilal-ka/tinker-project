-- Test Admin Access (Temporary - Run as superuser)
-- This will help identify if the issue is with RLS policies

-- 1. Temporarily disable RLS on admin_roles table
ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;

-- 2. Test direct query to admin_roles table
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID
SELECT * FROM public.admin_roles WHERE user_id = 'YOUR_USER_ID_HERE';

-- 3. If the above query returns data, the issue is with RLS policies
-- If it returns no data, the admin role wasn't properly inserted

-- 4. Re-enable RLS after testing
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- 5. Alternative: Check if the user exists in auth.users
-- Replace 'YOUR_EMAIL_HERE' with your actual email
SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL_HERE';

-- 6. If user exists but no admin role, manually insert admin role
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID
INSERT INTO public.admin_roles (user_id, role, permissions, is_active) 
VALUES (
  'YOUR_USER_ID_HERE', 
  'super_admin', 
  '["manage_colleges", "manage_events", "manage_keam_data", "manage_users", "manage_reviews"]'::jsonb,
  true
) ON CONFLICT (user_id) DO UPDATE SET
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = EXCLUDED.is_active,
  updated_at = now(); 