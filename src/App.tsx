import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Colleges from './pages/Colleges';
import CollegeDetails from './pages/CollegeDetails';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import KEAMPredictor from './pages/KEAMPredictor';
import KEAMResults from './pages/KEAMResults';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import CompleteProfile from './pages/CompleteProfile';
import Admin from './pages/Admin';
import AdminTest from './pages/AdminTest';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import { adminService } from './lib/supabase';

// Protected Route Component for Admin
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoggedIn } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoggedIn || !user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data: adminData, error } = await adminService.checkAdminStatus(user.id);
        
        if (error) {
          console.error('Admin check error:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!adminData);
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [isLoggedIn, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Protected Route Component for authenticated users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/colleges" element={<Colleges />} />
            <Route path="/colleges/:id" element={<CollegeDetails />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/keam-predictor" element={<KEAMPredictor />} />
            <Route path="/keam-results" element={<KEAMResults />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/complete-profile" 
              element={
                <ProtectedRoute>
                  <CompleteProfile />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes - Only for database-fed admins */}
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <Admin />
                </ProtectedAdminRoute>
              } 
            />
            
            {/* Admin Test Route - Only in development */}
            {process.env.NODE_ENV === 'development' && (
              <Route 
                path="/admin-test" 
                element={
                  <ProtectedRoute>
                    <AdminTest />
                  </ProtectedRoute>
                } 
              />
            )}
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;