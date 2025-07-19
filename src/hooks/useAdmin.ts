import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../lib/supabase';
import type { AdminRole } from '../lib/supabase';

interface UseAdminReturn {
  isAdmin: boolean | null;
  adminRole: AdminRole | null;
  permissions: string[];
  loading: boolean;
  error: string | null;
  checkAdminStatus: () => Promise<void>;
}

export const useAdmin = (): UseAdminReturn => {
  const { user, isLoggedIn } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAdminStatus = async () => {
    if (!isLoggedIn || !user) {
      setIsAdmin(false);
      setAdminRole(null);
      setPermissions([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: adminData, error: adminError } = await adminService.checkAdminStatus(user.id);
      
      if (adminError) {
        console.error('Admin check error:', adminError);
        setError(adminError.message);
        setIsAdmin(false);
        setAdminRole(null);
        setPermissions([]);
        return;
      }

      if (adminData) {
        setIsAdmin(true);
        setAdminRole(adminData);
        setPermissions(adminData.permissions || []);
      } else {
        setIsAdmin(false);
        setAdminRole(null);
        setPermissions([]);
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
      setError('Failed to check admin status');
      setIsAdmin(false);
      setAdminRole(null);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [isLoggedIn, user]);

  return {
    isAdmin,
    adminRole,
    permissions,
    loading,
    error,
    checkAdminStatus
  };
};

// Hook to check specific permissions
export const useAdminPermission = (requiredPermission: string): boolean => {
  const { permissions } = useAdmin();
  return permissions.includes(requiredPermission);
};

// Hook to check if user is super admin
export const useSuperAdmin = (): boolean => {
  const { adminRole } = useAdmin();
  return adminRole?.role === 'super_admin';
}; 