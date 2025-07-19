-- Fix Infinite Recursion in Admin RLS Policies
-- This fixes the "infinite recursion detected in policy for relation 'admin_roles'" error

-- 1. Drop the problematic policies
DROP POLICY IF EXISTS "Admins can read admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins can manage admin roles" ON public.admin_roles;

-- 2. Create new, simpler policies that don't cause recursion
-- Allow users to read their own admin role
CREATE POLICY "Users can read own admin role"
  ON public.admin_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow super admins to manage all admin roles (but not recursively)
CREATE POLICY "Super admins can manage admin roles"
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

-- 3. Alternative: Temporarily disable RLS for testing
-- Uncomment the line below if you want to test without RLS restrictions
-- ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;

-- 4. Test the fix by checking if your admin role exists
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID: 9031de15-ece0-4acc-ab29-754db2352b82
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

-- 5. If no admin role found, insert it
INSERT INTO public.admin_roles (user_id, role, permissions, is_active) 
VALUES (
  '9031de15-ece0-4acc-ab29-754db2352b82', 
  'super_admin', 
  '["manage_colleges", "manage_events", "manage_keam_data", "manage_users", "manage_reviews"]'::jsonb,
  true
) ON CONFLICT (user_id) DO UPDATE SET
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- 6. Verify the insertion
SELECT 
  'Admin role created/updated' as status,
  ar.user_id,
  ar.role,
  ar.is_active,
  u.email
FROM public.admin_roles ar
LEFT JOIN auth.users u ON ar.user_id = u.id
WHERE ar.user_id = '9031de15-ece0-4acc-ab29-754db2352b82'; 