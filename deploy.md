# 🚀 Quick Deployment Guide

## Make Your SeekGram Website Live

### **Option 1: Vercel (5 minutes)**

1. **Prepare your project**:
   ```bash
   # Make sure everything is committed
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your SeekGram repository
   - Add these environment variables:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your_anon_key_here
     ```
   - Click "Deploy"

3. **Share your live URL**: `https://seekgram.vercel.app`

### **Option 2: Netlify (5 minutes)**

1. **Deploy to Netlify**:
   - Visit [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Choose your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables in Site settings

2. **Share your live URL**: `https://seekgram.netlify.app`

### **Option 3: Manual Upload**

1. **Build your project**:
   ```bash
   npm run build
   ```

2. **Upload to any hosting service**:
   - Upload the `dist/` folder contents
   - Set up environment variables
   - Configure your domain

## 🔧 Environment Variables Required

Make sure to set these in your hosting platform:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 📱 Share Your Live Site

Once deployed, share these URLs:

- **Main Site**: `https://your-site.vercel.app`
- **Colleges**: `https://your-site.vercel.app/colleges`
- **Events**: `https://your-site.vercel.app/events`
- **KEAM Predictor**: `https://your-site.vercel.app/keam-predictor`

## 🎯 What Others Can Do

- ✅ Browse colleges and details
- ✅ View college images
- ✅ Check events
- ✅ Use KEAM predictor
- ✅ Register/login (if OAuth is set up)
- ✅ View admin panel (if they have admin access)

## 🚨 Important Notes

1. **Database**: Make sure your Supabase project is accessible
2. **Admin Access**: Only users with admin roles can access `/admin`
3. **OAuth**: Google login will work if properly configured
4. **Images**: College images are loaded from Unsplash URLs

## 🔗 Quick Links for Testing

- Homepage: `/`
- Colleges: `/colleges`
- Events: `/events`
- KEAM Predictor: `/keam-predictor`
- Login: `/login`
- Signup: `/signup`

---

**Your site will be live and accessible to anyone with the URL!** 🌐 