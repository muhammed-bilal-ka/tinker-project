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
2. **Authentication** > **Settings**
3. Verify **Site URL** is set correctly
4. Check **Redirect URLs** include your domain

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

### Testing

#### Test the Fix
1. Add the correct redirect URI
2. Wait 2-3 minutes
3. Try Google login again
4. Check browser console for errors

#### Debug Information
Run this in Supabase SQL Editor to check your setup:
```sql
-- Run verify-google-oauth.sql
```

### Still Having Issues?

#### Check These:
1. **Google Cloud Console** - OAuth consent screen configured
2. **Google Cloud Console** - Google+ API enabled
3. **Supabase** - Google provider enabled
4. **Supabase** - Client ID and Secret entered correctly
5. **Browser** - Clear cache and cookies

#### Get Help
1. Check Supabase logs in Dashboard
2. Check Google Cloud Console logs
3. Verify all steps in this guide
4. Test with incognito/private browser

---

**Quick Fix Summary:**
1. Go to Google Cloud Console > Credentials
2. Edit your OAuth 2.0 Client ID
3. Add: `https://ipbjhrdcpotxxjgnserz.supabase.co/auth/v1/callback`
4. Save and wait 2-3 minutes
5. Test again 