# Admin Access Control System

## Overview

The admin access control system ensures that only database-fed admins can access the admin panel and related functionality. This provides a secure, role-based access control system for the SeekGram application.

## 🔐 Security Features

### 1. Database-Driven Admin Roles
- Admin roles are stored in the `admin_roles` table
- Each admin has specific permissions defined in JSONB format
- Admin status is checked against the database on every request

### 2. Route Protection
- `/admin` route is protected by `ProtectedAdminRoute` component
- Non-admin users are redirected to `/unauthorized`
- Admin status is verified on every route access

### 3. UI Access Control
- Admin panel link only appears for verified admins
- Admin status is checked in real-time
- Graceful fallbacks for non-admin users

## 🏗️ Architecture

### Components

#### 1. `useAdmin` Hook (`src/hooks/useAdmin.ts`)
```typescript
const { isAdmin, adminRole, permissions, loading, error } = useAdmin();
```

**Features:**
- Real-time admin status checking
- Permission management
- Error handling
- Loading states

#### 2. `ProtectedAdminRoute` Component (`src/App.tsx`)
```typescript
<ProtectedAdminRoute>
  <Admin />
</ProtectedAdminRoute>
```

**Features:**
- Route-level protection
- Automatic redirects
- Loading states
- Error handling

#### 3. Header Component (`src/components/Header.tsx`)
```typescript
{isAdmin && (
  <Link to="/admin">
    <Shield className="w-4 h-4" />
    <span>Admin Panel</span>
  </Link>
)}
```

**Features:**
- Conditional admin link display
- Real-time status updates
- Mobile-responsive

## 📊 Database Schema

### `admin_roles` Table
```sql
CREATE TABLE public.admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'super_admin')),
  permissions JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Available Roles
- **`admin`**: Standard admin with limited permissions
- **`super_admin`**: Full system access

### Available Permissions
- `manage_colleges`: Manage college data
- `manage_events`: Manage events
- `manage_keam_data`: Manage KEAM data
- `manage_users`: Manage user accounts
- `manage_reviews`: Manage reviews and flags

## 🔧 Setup Instructions

### 1. Create Admin Role
```sql
-- Insert admin role for a user
INSERT INTO public.admin_roles (user_id, role, permissions, is_active) 
VALUES (
  'USER_UUID_HERE', 
  'super_admin', 
  '["manage_colleges", "manage_events", "manage_keam_data", "manage_users", "manage_reviews"]'::jsonb,
  true
);
```

### 2. Verify Admin Status
```sql
-- Check if user is admin
SELECT 
  ar.id,
  ar.role,
  ar.permissions,
  ar.is_active,
  u.email
FROM public.admin_roles ar
JOIN auth.users u ON ar.user_id = u.id
WHERE ar.user_id = 'USER_UUID_HERE' AND ar.is_active = true;
```

### 3. Test Admin Access
1. Login with admin user
2. Check if "Admin Panel" appears in header
3. Navigate to `/admin`
4. Verify access to admin dashboard

## 🛡️ Security Measures

### 1. Row Level Security (RLS)
```sql
-- RLS policies ensure only admins can access admin_roles
CREATE POLICY "Users can read own admin role"
  ON public.admin_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
```

### 2. Permission-Based Access
```typescript
// Check specific permissions
const canManageColleges = useAdminPermission('manage_colleges');
const isSuperAdmin = useSuperAdmin();
```

### 3. Route Protection
- All admin routes are protected
- Non-admin users are redirected
- No direct URL access for non-admins

## 🚀 Usage Examples

### 1. Check Admin Status in Component
```typescript
import { useAdmin } from '../hooks/useAdmin';

const MyComponent = () => {
  const { isAdmin, adminRole, permissions } = useAdmin();
  
  if (!isAdmin) {
    return <div>Access Denied</div>;
  }
  
  return <div>Welcome Admin: {adminRole?.role}</div>;
};
```

### 2. Check Specific Permissions
```typescript
import { useAdminPermission } from '../hooks/useAdmin';

const CollegeManager = () => {
  const canManageColleges = useAdminPermission('manage_colleges');
  
  if (!canManageColleges) {
    return <div>Insufficient permissions</div>;
  }
  
  return <CollegeManagementPanel />;
};
```

### 3. Conditional Rendering
```typescript
const Header = () => {
  const { isAdmin } = useAdmin();
  
  return (
    <nav>
      <Link to="/">Home</Link>
      {isAdmin && <Link to="/admin">Admin Panel</Link>}
    </nav>
  );
};
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Admin Link Not Showing
**Cause:** User doesn't have admin role in database
**Solution:** 
```sql
INSERT INTO public.admin_roles (user_id, role, permissions, is_active) 
VALUES ('USER_UUID', 'admin', '["manage_colleges"]'::jsonb, true);
```

#### 2. Access Denied on Admin Route
**Cause:** RLS policies blocking access
**Solution:** Check RLS policies and user permissions

#### 3. Admin Status Not Updating
**Cause:** Cache or state issues
**Solution:** Refresh page or clear browser cache

### Debug Commands
```sql
-- Check admin roles
SELECT * FROM public.admin_roles WHERE is_active = true;

-- Check specific user
SELECT ar.*, u.email 
FROM public.admin_roles ar 
JOIN auth.users u ON ar.user_id = u.id 
WHERE u.email = 'admin@example.com';
```

## 📝 Best Practices

### 1. Always Check Permissions
```typescript
// ✅ Good
const { isAdmin } = useAdmin();
if (!isAdmin) return <AccessDenied />;

// ❌ Bad
// Don't assume admin status
```

### 2. Use Specific Permissions
```typescript
// ✅ Good
const canManageUsers = useAdminPermission('manage_users');

// ❌ Bad
// Don't rely only on admin role
```

### 3. Handle Loading States
```typescript
// ✅ Good
const { isAdmin, loading } = useAdmin();
if (loading) return <LoadingSpinner />;
```

### 4. Secure Routes
```typescript
// ✅ Good
<ProtectedAdminRoute>
  <AdminComponent />
</ProtectedAdminRoute>
```

## 🔄 Future Enhancements

### 1. Role Hierarchy
- Implement role inheritance
- Add role-based permission inheritance

### 2. Audit Logging
- Log admin actions
- Track permission changes

### 3. Dynamic Permissions
- Runtime permission updates
- Permission caching

### 4. Multi-Tenant Support
- Organization-based admin roles
- Cross-organization permissions

---

**Note:** This system ensures that only database-fed admins can access admin functionality, providing a secure and scalable access control solution for the SeekGram application. 