# Environment Variables Setup

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp env.example .env.local
   ```

2. **Edit `.env.local` and fill in your values:**
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # App URL - IMPORTANT: Change this to switch between localhost and Vercel
   # For localhost development:
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # For Vercel production (replace with your actual Vercel URL):
   # NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

## Switching Between Localhost and Vercel

### For Localhost Development:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### For Vercel Production:
```env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## What This Controls

The `NEXT_PUBLIC_APP_URL` environment variable controls:
- ✅ Google OAuth redirect URLs
- ✅ All authentication callbacks
- ✅ API redirects

**Important:** After changing `NEXT_PUBLIC_APP_URL`, you must:
1. Restart your development server (`npm run dev`)
2. Update your Supabase redirect URLs in the dashboard:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add both URLs:
     - `http://localhost:3000/auth/callback` (for localhost)
     - `https://your-app.vercel.app/auth/callback` (for Vercel)

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (for localhost)
   - `https://your-app.vercel.app/auth/callback` (for Vercel)
4. Copy Client ID and Secret to Supabase Dashboard → Authentication → Providers → Google

## Vercel Deployment

When deploying to Vercel:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all environment variables from `.env.local`
3. Make sure `NEXT_PUBLIC_APP_URL` is set to your Vercel URL
4. Redeploy your application

