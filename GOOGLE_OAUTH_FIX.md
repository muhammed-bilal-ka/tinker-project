# Google OAuth Authentication Error Fix

## Problem Identified

Based on the error message shown in the browser (`Authentication Error: Authentication failed. Please try again.`), we've identified an issue with the Google OAuth authentication flow. The error occurs after attempting to sign in with Google, where the authentication process fails during the callback phase.

## Root Causes

After analyzing the code and configuration, the following issues have been identified:

1. **Redirect URI Mismatch**: The most common cause of OAuth authentication failures is a mismatch between the redirect URIs configured in Google Cloud Console and those used by the application.

2. **Environment Variable Configuration**: The placeholder values in the `.env` file for Google OAuth credentials need to be replaced with actual values.

3. **Supabase Client Configuration**: The `site_url` in the Supabase client configuration may not match the URL configured in Google Cloud Console.

## Solution Steps

### 1. Update Google Cloud Console Configuration

Ensure the following redirect URIs are added to your Google OAuth Client ID in Google Cloud Console:

- Primary Supabase Callback: `https://ipbjhrdcpotxxjgnserz.supabase.co/auth/v1/callback`
- Local Development Callback: `http://localhost:5173/auth/callback`

Also, add the following JavaScript origins:

- `http://localhost:5173`
- `https://ipbjhrdcpotxxjgnserz.supabase.co`

### 2. Update Environment Variables

Ensure your `.env` file has the correct Google OAuth credentials:

```
# Google OAuth Configuration (for Supabase)
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_actual_google_client_secret

# App Configuration
VITE_APP_NAME=SeekGram
VITE_APP_URL=http://localhost:5173
```

### 3. Modify the Supabase Client Configuration

Update the Supabase client configuration in `src/lib/supabase.ts` to ensure it uses the correct site URL:

```typescript
const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173'

// Create Supabase client with additional options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Set the site URL to match our application URL
    site_url: appUrl
  }
})
```

### 4. Update the Google OAuth Sign-In Function

Modify the `signInWithGoogleEnhanced` function in `src/lib/auth.ts` to use the correct redirect URL:

```typescript
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
      throw error;
    }

    console.log('Google OAuth initiated successfully:', data);
    return { data, error: null, success: true };
  } catch (error) {
    console.error('Google sign-in failed:', error);
    return { data: null, error, success: false };
  }
};
```

### 5. Ensure Supabase Project Configuration

In your Supabase project dashboard:

1. Go to Authentication > URL Configuration
2. Ensure the Site URL is set to your production URL
3. Add the following to the Redirect URLs:
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5173/**`

### 6. Clear Browser Cache and Cookies

After making these changes, clear your browser's cache and cookies for the localhost domain to ensure a fresh authentication attempt.

## Testing the Fix

1. Restart your development server
2. Open the browser console (F12) to monitor for any errors
3. Attempt to sign in with Google
4. Check the console logs for the authentication flow

## Additional Troubleshooting

If the issue persists:

1. Verify that your Google OAuth Client ID and Secret are correct
2. Check that your Google OAuth consent screen is properly configured
3. Ensure that the Google OAuth API is enabled in your Google Cloud Console
4. Try creating a new OAuth Client ID in Google Cloud Console with the same configuration

## References

- [Supabase Google OAuth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Troubleshooting OAuth 2.0 and OpenID Connect](https://developers.google.com/identity/protocols/oauth2/troubleshoot-authorization)