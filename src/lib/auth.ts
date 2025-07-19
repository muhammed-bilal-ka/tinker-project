import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

// Handle OAuth callback and redirect logic
export const handleOAuthCallback = async (user: User) => {
  try {
    // Check if user profile exists
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking user profile:', error);
      return '/complete-profile';
    }

    // If profile doesn't exist, redirect to complete profile
    if (!profile) {
      return '/complete-profile';
    }

    // If profile exists, redirect to home
    return '/';
  } catch (error) {
    console.error('Error in OAuth callback handling:', error);
    return '/complete-profile';
  }
};

// Enhanced Google OAuth sign-in with better error handling
export const signInWithGoogleEnhanced = async (redirectTo?: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || `${window.location.origin}/complete-profile`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'email profile openid'
      }
    });

    if (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }

    console.log('Google OAuth initiated successfully:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Google sign-in failed:', error);
    throw error;
  }
};

// Check if user has completed profile
export const hasCompletedProfile = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking profile completion:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in hasCompletedProfile:', error);
    return false;
  }
};

// Get user profile data
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return { data: null, error };
  }
};

// Create user profile from OAuth data
export const createUserProfileFromOAuth = async (user: User) => {
  try {
    const { user_metadata } = user;
    
    // Extract user data from OAuth metadata
    const profileData = {
      user_id: user.id,
      full_name: user_metadata?.full_name || user.user_metadata?.name || 'Unknown User',
      phone: user_metadata?.phone || '',
      city: user_metadata?.city || '',
      pincode: user_metadata?.pincode || '',
      profession: user_metadata?.profession || 'Student',
      qualification: user_metadata?.qualification || 'High School',
      ug_college: user_metadata?.ug_college || '',
      ug_branch: user_metadata?.ug_branch || '',
      ug_year: user_metadata?.ug_year || '',
      pg_college: user_metadata?.pg_college || '',
      pg_branch: user_metadata?.pg_branch || '',
      pg_year: user_metadata?.pg_year || '',
      consent: true
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in createUserProfileFromOAuth:', error);
    return { data: null, error };
  }
};

// Sign out with cleanup
export const signOutWithCleanup = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    
    // Clear any local storage or state
    localStorage.removeItem('user_profile');
    sessionStorage.clear();
    
    return { error: null };
  } catch (error) {
    console.error('Error in signOutWithCleanup:', error);
    throw error;
  }
}; 