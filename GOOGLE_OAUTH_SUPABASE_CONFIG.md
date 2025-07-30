# Configuring Google OAuth in Supabase

This guide provides step-by-step instructions for configuring Google OAuth in Supabase for the SeekGram application.

## Supabase Configuration

### Step 1: Access Authentication Settings

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `SeekGram`
3. Navigate to **Authentication** in the left sidebar
4. Click on **Providers**

### Step 2: Configure Google Provider

1. Find **Google** in the list of providers and click on it
2. Toggle the switch to **Enabled**
3. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
4. Save the changes

### Step 3: Configure URL Settings

1. In the Authentication section, click on **URL Configuration**
2. Set the **Site URL** to your production URL (e.g., `https://seekgram.vercel.app`)
3. Add the following URLs to the **Redirect URLs** list:
   ```
   http://localhost:5173/auth/callback
   http://localhost:5174/auth/callback
   http://localhost:5173/**
   http://localhost:5174/**
   https://seekgram.vercel.app/auth/callback
   ```
4. Save the changes

## Google Cloud Console Configuration

### Step 1: Access OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**

### Step 2: Configure OAuth Client

1. Find your OAuth 2.0 Client ID and click on it to edit
2. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:5173
   http://localhost:5174
   https://seekgram.vercel.app
   ```
3. Under **Authorized redirect URIs**, add:
   ```
   https://ipbjhrdcpotxxjgnserz.supabase.co/auth/v1/callback
   http://localhost:5173/auth/callback
   http://localhost:5174/auth/callback
   ```
4. Click **Save**

### Step 3: Configure OAuth Consent Screen

1. Navigate to **OAuth consent screen**
2. Ensure your app information is correct
3. Under **Authorized domains**, add:
   ```
   ipbjhrdcpotxxjgnserz.supabase.co
   localhost
   seekgram.vercel.app
   ```
4. Save the changes

## Testing the Configuration

1. Clear your browser cache and cookies
2. Start your development server: `npm run dev`
3. Navigate to the login page
4. Click "Sign in with Google"
5. Complete the Google authentication process
6. You should be redirected back to your application and successfully logged in

## Troubleshooting

If you encounter issues, refer to the [Google OAuth Troubleshooting Guide](./GOOGLE_OAUTH_TROUBLESHOOTING.md) for detailed solutions to common problems.

## Important Notes

- After making changes to OAuth settings, wait 2-3 minutes for the changes to propagate before testing
- Always test authentication flows in both development and production environments
- Keep your Client ID and Client Secret secure and never commit them to your repository
- Consider using environment variables for all sensitive information