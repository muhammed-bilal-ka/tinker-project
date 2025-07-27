import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { signInWithGoogleEnhanced, handleOAuthCallback, hasCompletedProfile } from '../lib/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { profileService } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Enforce profile completion after login/signup
  useEffect(() => {
    const checkProfile = async () => {
      if (user) {
        const { data } = await profileService.getProfile(user.id);
        // Only require full_name, phone, email, profession, qualification (education)
        const isComplete = !!(data && data.full_name && data.phone && user.email && data.profession && data.qualification);
        setProfileComplete(isComplete);
        if (!isComplete && location.pathname !== '/complete-profile') {
          navigate('/complete-profile', { replace: true });
        }
      }
    };
    if (user) checkProfile();
  }, [user, navigate, location]);

  // Block all routes except /complete-profile if profile is incomplete
  if (user && !profileComplete && location.pathname !== '/complete-profile') {
    navigate('/complete-profile', { replace: true });
    return null;
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await signInWithGoogleEnhanced();
      
      if (error) {
        console.error('Google OAuth error:', error);
        throw error;
      }
      
      // If successful, the user will be redirected to Google
      console.log('Google OAuth initiated:', data);
      
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    isLoggedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};