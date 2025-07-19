-- Complete Admin Access Fix
-- This will completely fix the admin access issue

-- 1. First, let's see what's in the admin_roles table
SELECT 'Current admin_roles table contents:' as info;
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

-- 2. Completely disable RLS on admin_roles table
ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;

-- 3. Drop all existing policies on admin_roles
DROP POLICY IF EXISTS "Users can read own admin role" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins can manage admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Admins can read admin roles" ON public.admin_roles;

-- 4. Clear any existing admin role for your user and recreate it
DELETE FROM public.admin_roles WHERE user_id = '9031de15-ece0-4acc-ab29-754db2352b82';

-- 5. Insert fresh admin role
INSERT INTO public.admin_roles (user_id, role, permissions, is_active) 
VALUES (
  '9031de15-ece0-4acc-ab29-754db2352b82', 
  'super_admin', 
  '["manage_colleges", "manage_events", "manage_keam_data", "manage_users", "manage_reviews"]'::jsonb,
  true
);

-- 6. Verify the insertion worked
SELECT 'Admin role verification:' as info;
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
WHERE ar.user_id = '9031de15-ece0-4acc-ab29-754db2352b82';

-- 7. Test the admin functions
SELECT 'Testing admin functions:' as info;
SELECT is_admin('9031de15-ece0-4acc-ab29-754db2352b82') as is_admin_result;
SELECT is_super_admin('9031de15-ece0-4acc-ab29-754db2352b82') as is_super_admin_result;

-- 8. Check if the table structure is correct
SELECT 'Table structure check:' as info;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'admin_roles'
ORDER BY ordinal_position;

-- 9. If everything looks good, you can optionally re-enable RLS with simple policies
-- Uncomment the lines below ONLY if steps 1-8 work correctly:

/*
-- Re-enable RLS with simple policies
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Simple policy: allow authenticated users to read admin_roles
CREATE POLICY "Allow authenticated users to read admin_roles"
  ON public.admin_roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for super admins to manage admin_roles
CREATE POLICY "Super admins can manage admin_roles"
  ON public.admin_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar 
      WHERE ar.user_id = auth.uid() 
      AND ar.role = 'super_admin' 
      AND ar.is_active = true
    )
  );
*/ 