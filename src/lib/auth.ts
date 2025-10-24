import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

// Handle OAuth callback and redirect logic
export const handleOAuthCallback = async (user: User) => {
  try {
    console.log('handleOAuthCallback called with user:', user.id);
    
    // Ensure we have the latest session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error('No active session found in callback handler');
      return '/login';
    }
    
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

    // If profile doesn't exist, create a basic profile and redirect to complete profile
    if (!profile) {
      console.log('No profile found, creating basic profile and redirecting to complete profile');
      await createUserProfileFromOAuth(user);
      return '/complete-profile';
    }

    // Check if profile is complete (has required fields)
    const isComplete = await hasCompletedProfile(user.id);
    if (!isComplete) {
      console.log('Profile incomplete, redirecting to complete profile');
      return '/complete-profile';
    }

    // If profile exists and is complete, redirect to home
    console.log('Complete profile found, redirecting to home');
    return '/';
  } catch (error) {
    console.error('Error in OAuth callback handling:', error);
    return '/login';
  }
};

// Enhanced Google OAuth sign-in with better error handling and fallback mechanism
export const signInWithGoogleEnhanced = async (redirectTo?: string) => {
  try {
    console.log('Starting Google OAuth flow with redirectTo:', redirectTo || 'default');
    
    // Use the auth callback route as the primary redirect
    const callbackUrl = `${window.location.origin}/auth/callback`;
    console.log('Using callback URL:', callbackUrl);
    
    // Primary OAuth flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'email profile openid'
      }
    });

    if (error) {
      console.error('Primary Google OAuth flow error:', error);
      // Attempt fallback with different redirect URI format
      return await googleOAuthFallback(redirectTo);
    }

    console.log('Google OAuth initiated successfully:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Google sign-in failed:', error);
    // Try fallback as last resort
    return await googleOAuthFallback(redirectTo);
  }
};

// Fallback Google OAuth implementation with alternative redirect URI format
const googleOAuthFallback = async (redirectTo?: string) => {
  try {
    console.log('Attempting Google OAuth fallback mechanism...');
    
    // Try with complete-profile as fallback
    const fallbackRedirectTo = `${window.location.origin}/complete-profile`;
    console.log('Using fallback redirect URL:', fallbackRedirectTo);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: fallbackRedirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'email profile openid'
      }
    });

    if (error) {
      console.error('Fallback Google OAuth also failed:', error);
      // Try second fallback method
      return await googleOAuthSecondFallback(redirectTo);
    }

    console.log('Google OAuth fallback succeeded:', data);
    return { data, error: null };
  } catch (error) {
    console.error('First fallback failed, trying second fallback:', error);
    return await googleOAuthSecondFallback(redirectTo);
  }
};

// Second fallback method using a different approach
const googleOAuthSecondFallback = async (redirectTo?: string) => {
  try {
    console.log('Attempting second Google OAuth fallback mechanism...');
    
    // Try with Supabase default callback and site URL approach
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Don't specify redirectTo, let Supabase use its configured Site URL
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'email profile openid',
        skipBrowserRedirect: false // Ensure browser redirect happens
      }
    });

    if (error) {
      console.error('Second fallback Google OAuth also failed:', error);
      throw error;
    }

    console.log('Second fallback Google OAuth succeeded:', data);
    return { data, error: null };
  } catch (error) {
    console.error('All Google OAuth attempts failed:', error);
    throw error;
  }
};

// Check if user has completed profile
export const hasCompletedProfile = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking profile completion:', error);
      return false;
    }

    // Check if all required fields are filled
    if (!data) return false;
    
    // Get user email from auth
    const { data: userData } = await supabase.auth.getUser();
    const userEmail = userData?.user?.email;
    
    // Check required fields: full_name, phone, email, profession, qualification
    return !!(data.full_name && data.phone && userEmail && data.profession && data.qualification);
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
    // Only set non-required fields with defaults
    // Leave required fields empty so user is forced to complete profile
    const profileData = {
      user_id: user.id,
      // Use name from OAuth if available, but don't set a default
      full_name: user_metadata?.full_name || user.user_metadata?.name || '',
      // Leave phone empty to force user to complete it
      phone: '',
      city: user_metadata?.city || '',
      pincode: user_metadata?.pincode || '',
      // Leave profession empty to force user to complete it
      profession: '',
      // Leave qualification empty to force user to complete it
      qualification: '',
      ug_college: user_metadata?.ug_college || '',
      ug_branch: user_metadata?.ug_branch || '',
      ug_year: user_metadata?.ug_year || '',
      pg_college: user_metadata?.pg_college || '',
      pg_branch: user_metadata?.pg_branch || '',
      pg_year: user_metadata?.pg_year || '',
      consent: false // Force user to explicitly consent
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