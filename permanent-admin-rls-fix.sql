-- Permanent Admin RLS Fix
-- This creates RLS policies that don't cause infinite recursion

-- 1. First, disable RLS temporarily
ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read admin_roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins can manage admin_roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Users can read own admin role" ON public.admin_roles;
DROP POLICY IF EXISTS "Admins can read admin roles" ON public.admin_roles;

-- 3. Create a function to check admin status without recursion
CREATE OR REPLACE FUNCTION check_admin_status_safe(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  -- Use a direct query that bypasses RLS for this specific check
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_uuid 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create a function to check super admin status without recursion
CREATE OR REPLACE FUNCTION check_super_admin_status_safe(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  -- Use a direct query that bypasses RLS for this specific check
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_uuid 
    AND role = 'super_admin' 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Re-enable RLS
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- 6. Create new policies that use the safe functions
-- Policy 1: Users can read their own admin role
CREATE POLICY "Users can read own admin role"
  ON public.admin_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy 2: Super admins can manage all admin roles
CREATE POLICY "Super admins can manage admin roles"
  ON public.admin_roles
  FOR ALL
  TO authenticated
  USING (check_super_admin_status_safe(auth.uid()));

-- Policy 3: Allow authenticated users to read admin_roles (for admin checks)
CREATE POLICY "Allow authenticated users to read admin_roles"
  ON public.admin_roles
  FOR SELECT
  TO authenticated
  USING (true);

-- 7. Update the existing admin functions to use the safe versions
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN check_admin_status_safe(user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_super_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN check_super_admin_status_safe(user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Test the functions
SELECT 'Testing admin functions:' as info;
SELECT is_admin('9031de15-ece0-4acc-ab29-754db2352b82') as is_admin_result;
SELECT is_super_admin('9031de15-ece0-4acc-ab29-754db2352b82') as is_super_admin_result;

-- 9. Verify admin role exists
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

-- 10. Test direct query with RLS enabled
SELECT 'Direct query test with RLS:' as info;
SELECT 
  COUNT(*) as admin_roles_count
FROM public.admin_roles 
WHERE user_id = '9031de15-ece0-4acc-ab29-754db2352b82'; 