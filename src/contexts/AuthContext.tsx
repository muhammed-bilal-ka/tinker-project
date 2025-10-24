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
        // Check if profile exists
        const { data } = await profileService.getProfile(user.id);
        
        // If no profile exists, create a basic one
        if (!data) {
          console.log('No profile found, creating basic profile');
          // Import the function to create a basic profile
          const { createUserProfileFromOAuth } = await import('../lib/auth');
          await createUserProfileFromOAuth(user);
          setProfileComplete(false);
          if (location.pathname !== '/complete-profile') {
            navigate('/complete-profile', { replace: true });
          }
          return;
        }
        
        // Check if profile is complete
        // Only require full_name, phone, email, profession, qualification (education)
        const isComplete = !!(data.full_name && data.phone && user.email && data.profession && data.qualification);
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
      // Show loading indicator or disable button here if needed
      
      // Try enhanced Google sign-in with fallback mechanisms
      const { data, error } = await signInWithGoogleEnhanced();
      
      if (error) {
        console.error('Google OAuth error after all fallbacks:', error);
        // Display user-friendly error message
        alert('Unable to sign in with Google. Please try again or use email sign-in.');
        throw error;
      }
      
      // If successful, the user will be redirected to Google
      console.log('Google OAuth initiated successfully:', data);
      
      // Return success for UI handling
      return { success: true, data };
    } catch (error: any) {
      console.error('Google sign-in completely failed:', error);
      
      // Provide user-friendly error message
      const errorMessage = error?.message || 'Unable to sign in with Google. Please try again later.';
      alert(errorMessage);
      
      // Return failure for UI handling
      return { success: false, error };
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // If login successful, check profile completion
    if (!error && data.user) {
      // Profile check will be handled by the useEffect in AuthProvider
      // that redirects to /complete-profile if needed
    }
    
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    // If signup successful, create a basic profile
    if (!error && data.user) {
      // The profile check in useEffect will handle redirection to /complete-profile
      // We don't need to create a profile here as it will be created when the user first logs in
      // and the AuthContext useEffect detects no profile exists
    }
    
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