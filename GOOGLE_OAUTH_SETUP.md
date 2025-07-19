# Google OAuth Setup Guide for SeekGram

## Overview
This guide will help you set up Google OAuth authentication for your SeekGram application using Supabase.

## Prerequisites
- Supabase project with authentication enabled
- Google Cloud Console account
- Domain or localhost for testing

## Step 1: Google Cloud Console Setup

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### 1.2 Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required information:
   - App name: "SeekGram"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `email`
   - `profile`
   - `openid`
5. Add test users (your email)

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   http://localhost:5173/auth/callback
   http://localhost:3000/auth/callback
   ```
5. Copy the Client ID and Client Secret

## Step 2: Supabase Configuration

### 2.1 Enable Google Provider
1. Go to your Supabase Dashboard
2. Navigate to "Authentication" > "Providers"
3. Enable Google provider
4. Enter your Google Client ID and Client Secret
5. Save the configuration

### 2.2 Configure Site URL
1. Go to "Authentication" > "Settings"
2. Set Site URL to your domain or localhost
3. Add redirect URLs:
   ```
   http://localhost:5173/complete-profile
   https://yourdomain.com/complete-profile
   ```

## Step 3: Environment Variables

### 3.1 Create .env file
Create a `.env` file in your project root:

```env
# Supabase Configuration
VITE_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth (Optional - for additional features)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Configuration
VITE_APP_NAME=SeekGram
VITE_APP_URL=http://localhost:5173
```

### 3.2 Get Supabase Credentials
1. Go to Supabase Dashboard > Settings > API
2. Copy Project URL and anon/public key

## Step 4: Testing the Setup

### 4.1 Test Google Login
1. Start your development server
2. Go to `/login` page
3. Click "Continue with Google"
4. You should be redirected to Google OAuth
5. After authentication, you should be redirected to `/complete-profile`

### 4.2 Debug Common Issues
- Check browser console for errors
- Verify redirect URIs match exactly
- Ensure Google+ API is enabled
- Check Supabase logs for authentication errors

## Step 5: Production Deployment

### 5.1 Update Redirect URIs
1. Add your production domain to Google OAuth redirect URIs
2. Update Supabase site URL and redirect URLs
3. Update environment variables for production

### 5.2 Security Considerations
- Never commit `.env` files to version control
- Use environment variables in production
- Regularly rotate OAuth credentials
- Monitor authentication logs

## Troubleshooting

### Common Issues

#### 1. "redirect_uri_mismatch" Error
- Ensure redirect URIs in Google Console match Supabase callback URL
- Check for trailing slashes or protocol mismatches

#### 2. "invalid_client" Error
- Verify Client ID and Client Secret are correct
- Check if OAuth consent screen is configured properly

#### 3. "access_denied" Error
- Ensure your email is added as a test user
- Check if the app is in testing mode

#### 4. Supabase Authentication Errors
- Verify Google provider is enabled in Supabase
- Check Supabase logs for detailed error messages
- Ensure site URL is configured correctly

### Debug Steps
1. Check browser network tab for failed requests
2. Review Supabase authentication logs
3. Verify environment variables are loaded correctly
4. Test with different browsers/devices

## Advanced Configuration

### Custom Scopes
You can request additional scopes by modifying the OAuth call:

```typescript
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: 'email profile openid https://www.googleapis.com/auth/calendar.readonly',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });
};
```

### Custom Redirect Handling
```typescript
// Handle OAuth callback
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Check if user profile exists
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (!profile) {
          navigate('/complete-profile');
        } else {
          navigate('/');
        }
      }
    }
  );

  return () => subscription.unsubscribe();
}, [navigate]);
```

## Security Best Practices

1. **HTTPS Only**: Always use HTTPS in production
2. **Secure Headers**: Implement proper security headers
3. **Session Management**: Use secure session handling
4. **Input Validation**: Validate all user inputs
5. **Rate Limiting**: Implement rate limiting for auth endpoints
6. **Monitoring**: Monitor authentication attempts and failures

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase and Google Cloud Console logs
3. Test with a fresh browser session
4. Verify all configuration steps are completed

---

**Last Updated**: December 2024
**Version**: 1.0.0 