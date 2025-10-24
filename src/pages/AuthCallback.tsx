import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { handleOAuthCallback } from '../lib/auth';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Auth callback page loaded, URL:', window.location.href);
        console.log('Query params:', location.search);
        
        // Check if there's an error in the URL (from OAuth provider)
        const urlParams = new URLSearchParams(location.search);
        const errorParam = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        if (errorParam) {
          console.error('OAuth error from provider:', errorParam, errorDescription);
          setError(`Authentication error: ${errorDescription || errorParam}`);
          setLoading(false);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Process the OAuth callback if needed
        // This is only needed if the URL contains a code or token parameter
        if (urlParams.has('code') || urlParams.has('token')) {
          console.log('Processing OAuth callback with code/token');
          // Let Supabase handle the token exchange
          await supabase.auth.getSession();
        }
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError('Authentication failed. Please try again.');
          setLoading(false);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!session || !session.user) {
          console.error('No session or user found after OAuth callback');
          setError('Authentication failed. Please try again.');
          setLoading(false);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        console.log('OAuth callback successful, user authenticated:', session.user.id);
        
        // Determine where to redirect the user based on their profile status
        const redirectPath = await handleOAuthCallback(session.user);
        console.log('Redirecting to:', redirectPath);
        
        // Redirect to the appropriate page
        navigate(redirectPath, { replace: true });
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    // Execute the callback handler
    handleCallback();
  }, [navigate, location]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Authentication Error</h2>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <p className="mt-2 text-sm text-gray-500">Redirecting you to the login page...</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Completing Sign In</h2>
          <p className="mt-2 text-sm text-gray-500">Please wait while we complete your authentication...</p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;