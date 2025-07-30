# Google OAuth Troubleshooting Guide

## Error: redirect_uri_mismatch

### Problem
You're seeing this error:
```
Error 400: redirect_uri_mismatch
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy.
```

### Root Cause
The redirect URI that Supabase is using doesn't match what's configured in your Google Cloud Console.

### Solution

#### Step 1: Get Your Supabase Project URL
Your Supabase project URL is: `https://ipbjhrdcpotxxjgnserz.supabase.co`

#### Step 2: Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** > **Credentials**

#### Step 3: Edit Your OAuth 2.0 Client
1. Find your OAuth 2.0 Client ID
2. Click on it to edit
3. Scroll to **Authorized redirect URIs**

#### Step 4: Add the Missing URI
Add this exact URI:
```
https://ipbjhrdcpotxxjgnserz.supabase.co/auth/v1/callback
```

#### Step 5: Add Development URIs (Optional)
Also add these for local development:
```
http://localhost:5173/auth/callback
http://localhost:5174/auth/callback
http://localhost:3000/auth/callback
```

#### Step 6: Save and Wait
1. Click **Save**
2. Wait 2-3 minutes for changes to propagate
3. Try Google login again

### Verification Steps

#### Check Google Console
1. Go to your OAuth 2.0 Client settings
2. Verify the redirect URI is exactly:
   ```
   https://ipbjhrdcpotxxjgnserz.supabase.co/auth/v1/callback
   ```
3. No extra spaces, no trailing slashes

#### Check Supabase Settings
1. Go to Supabase Dashboard
2. **Authentication** > **URL Configuration**
3. Verify **Site URL** is set correctly
4. Check **Redirect URLs** include your domain and local development URLs

### Common Mistakes

#### ❌ Wrong Protocol
- **Wrong**: `http://ipbjhrdcpotxxjgnserz.supabase.co/auth/v1/callback`
- **Correct**: `https://ipbjhrdcpotxxjgnserz.supabase.co/auth/v1/callback`

#### ❌ Extra Slashes
- **Wrong**: `https://ipbjhrdcpotxxjgnserz.supabase.co/auth/v1/callback/`
- **Correct**: `https://ipbjhrdcpotxxjgnserz.supabase.co/auth/v1/callback`

#### ❌ Wrong Path
- **Wrong**: `https://ipbjhrdcpotxxjgnserz.supabase.co/callback`
- **Correct**: `https://ipbjhrdcpotxxjgnserz.supabase.co/auth/v1/callback`

## Authentication Error: Authentication failed. Please try again.

### Problem
After signing in with Google and granting permissions, you see an "Authentication Error" message and are redirected back to the login page without being logged in.

### Solutions

#### 1. Check Authorized JavaScript Origins in Google Cloud Console
Ensure your application's domain is added to the Authorized JavaScript origins in Google Cloud Console:

```
http://localhost:5173
http://localhost:5174
```

#### 2. Verify Redirect URLs in Supabase Dashboard
In the Supabase Dashboard under Authentication > URL Configuration, add these URLs to the redirect allow list:

```
http://localhost:5173/auth/callback
http://localhost:5174/auth/callback
http://localhost:5173/**
http://localhost:5174/**
```

#### 3. Ensure Environment Variables Match
Make sure your `.env` file has the correct `VITE_APP_URL` that matches the port your application is running on (e.g., `http://localhost:5173`).

#### 4. Supabase Client Configuration
The Supabase client should be initialized with proper auth options:

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    site_url: appUrl
  }
});
```

#### 5. Clear Browser Cache and Cookies
Sometimes authentication issues can be resolved by clearing your browser's cache and cookies.

### Session Management Issues

#### Problem
Session is not maintained after successful authentication.

#### Solutions

- **Check Browser Storage**: Ensure cookies and local storage are enabled in your browser.

- **Verify Session Handling**: The `AuthCallback` component should properly handle the session:

```typescript
// In AuthCallback.tsx
const { data: { session }, error: sessionError } = await supabase.auth.getSession();

if (session && session.user) {
  // Process the session and redirect appropriately
  const redirectPath = await handleOAuthCallback(session.user);
  navigate(redirectPath, { replace: true });
}
```

### Multi-tier Fallback Mechanism

Our application implements a three-tier fallback mechanism for Google OAuth:

1. **Primary Flow**: Uses `/auth/callback` as the redirect URL
2. **First Fallback**: Uses `/complete-profile` as the redirect URL
3. **Second Fallback**: Uses Supabase's default site URL configuration

This ensures maximum compatibility across different environments and configurations.

## Testing Your OAuth Flow

1. Clear browser cookies and local storage
2. Restart the application with `npm run dev`
3. Navigate to the login page
4. Click "Sign in with Google"
5. Complete the Google authentication process
6. Monitor the browser console and terminal for errors

## Console Error Debugging

If you encounter OAuth issues, check the browser console for errors:

1. Open Developer Tools (F12 or Right-click → Inspect)
2. Go to the Console tab
3. Look for errors related to:
   - `auth/callback`
   - `supabase`
   - `OAuth`
   - `CORS` issues

## Still Having Issues?

### Check These:
1. **Google Cloud Console** - OAuth consent screen configured
2. **Google Cloud Console** - Google+ API enabled
3. **Supabase** - Google provider enabled
4. **Supabase** - Client ID and Secret entered correctly
5. **Browser** - Clear cache and cookies
6. **Application Code** - Ensure the `AuthCallback` component is properly implemented
7. **Environment Variables** - Verify all URLs match your current development environment
8. **Create a New OAuth Client ID** - Sometimes creating a new OAuth Client ID with the same configuration can resolve persistent issues