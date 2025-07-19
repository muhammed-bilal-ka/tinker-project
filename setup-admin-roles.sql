-- Setup Admin Roles for Secure Access Control
-- This script ensures only database-fed admins can access admin functionality

-- 1. First, let's check current admin roles
SELECT 'Current admin roles:' as info;
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

-- 2. Ensure admin_roles table has proper structure
DO $$
BEGIN
  -- Add unique constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'admin_roles_user_id_unique'
  ) THEN
    ALTER TABLE public.admin_roles ADD CONSTRAINT admin_roles_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- 3. Create function to safely check admin status
CREATE OR REPLACE FUNCTION is_user_admin(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_uuid 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create function to check super admin status
CREATE OR REPLACE FUNCTION is_user_super_admin(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_uuid 
    AND role = 'super_admin' 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create function to get user permissions
CREATE OR REPLACE FUNCTION get_user_permissions(user_uuid uuid)
RETURNS jsonb AS $$
DECLARE
  user_permissions jsonb;
BEGIN
  SELECT permissions INTO user_permissions
  FROM public.admin_roles 
  WHERE user_id = user_uuid 
  AND is_active = true;
  
  RETURN COALESCE(user_permissions, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Ensure RLS policies are properly set up
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own admin role" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins can manage admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Admins can read admin roles" ON public.admin_roles;

-- Create new, secure policies
CREATE POLICY "Users can read own admin role"
  ON public.admin_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage admin roles"
  ON public.admin_roles
  FOR ALL
  TO authenticated
  USING (is_user_super_admin(auth.uid()));

-- 7. Create admin role for testing (replace with actual user ID)
-- Uncomment and modify the line below with your actual user ID
-- INSERT INTO public.admin_roles (user_id, role, permissions, is_active) 
-- VALUES (
--   'YOUR_USER_ID_HERE', 
--   'super_admin', 
--   '["manage_colleges", "manage_events", "manage_keam_data", "manage_users", "manage_reviews"]'::jsonb,
--   true
-- ) ON CONFLICT (user_id) DO UPDATE SET
--   role = EXCLUDED.role,
--   permissions = EXCLUDED.permissions,
--   is_active = EXCLUDED.is_active,
--   updated_at = now();

-- 8. Test the functions
SELECT 'Testing admin functions:' as info;
-- Replace 'YOUR_USER_ID_HERE' with actual user ID for testing
-- SELECT is_user_admin('YOUR_USER_ID_HERE') as is_admin;
-- SELECT is_user_super_admin('YOUR_USER_ID_HERE') as is_super_admin;
-- SELECT get_user_permissions('YOUR_USER_ID_HERE') as permissions;

-- 9. Create view for easy admin management
CREATE OR REPLACE VIEW admin_users_view AS
SELECT 
  ar.id,
  ar.user_id,
  ar.role,
  ar.permissions,
  ar.is_active,
  ar.created_at,
  ar.updated_at,
  u.email,
  u.created_at as user_created_at,
  u.last_sign_in_at
FROM public.admin_roles ar
JOIN auth.users u ON ar.user_id = u.id
WHERE ar.is_active = true
ORDER BY ar.created_at DESC;

-- 10. Grant permissions for the view
GRANT SELECT ON admin_users_view TO authenticated;

-- 11. Create function to add admin role
CREATE OR REPLACE FUNCTION add_admin_role(
  target_user_id uuid,
  admin_role text DEFAULT 'admin',
  admin_permissions jsonb DEFAULT '["manage_colleges", "manage_events"]'::jsonb
)
RETURNS boolean AS $$
BEGIN
  -- Only super admins can add admin roles
  IF NOT is_user_super_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only super admins can add admin roles';
  END IF;
  
  INSERT INTO public.admin_roles (user_id, role, permissions, is_active)
  VALUES (target_user_id, admin_role, admin_permissions, true)
  ON CONFLICT (user_id) DO UPDATE SET
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions,
    is_active = EXCLUDED.is_active,
    updated_at = now();
    
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create function to remove admin role
CREATE OR REPLACE FUNCTION remove_admin_role(target_user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Only super admins can remove admin roles
  IF NOT is_user_super_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only super admins can remove admin roles';
  END IF;
  
  UPDATE public.admin_roles 
  SET is_active = false, updated_at = now()
  WHERE user_id = target_user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Final verification
SELECT 'Admin setup verification:' as info;
SELECT 
  'Admin functions created' as function_status,
  'RLS policies configured' as policy_status,
  'Admin view created' as view_status,
  'Admin management functions ready' as management_status;

-- 14. Instructions for adding admin users
SELECT 'To add an admin user:' as instruction;
SELECT 
  '1. Get the user ID from auth.users table' as step1,
  '2. Run: SELECT add_admin_role(''USER_ID'', ''super_admin'', ''["manage_colleges", "manage_events", "manage_keam_data", "manage_users", "manage_reviews"]''::jsonb)' as step2,
  '3. Verify with: SELECT * FROM admin_users_view' as step3;

-- 15. Show current admin users
SELECT 'Current admin users:' as info;
SELECT * FROM admin_users_view; 