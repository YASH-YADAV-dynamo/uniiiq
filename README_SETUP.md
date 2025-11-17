# Supabase Setup Guide

This guide will help you set up Supabase for this application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be fully provisioned

## 2. Get Your API Keys

1. Go to Project Settings > API
2. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## 3. Set Up the Database Schema ⚠️ REQUIRED FIRST STEP

**⚠️ CRITICAL: You MUST run the database setup script BEFORE using the application!**

### Quick Setup (Recommended)

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Open the file `supabase/complete-setup.sql` in your project
6. **Copy the ENTIRE contents** of the file
7. Paste it into the Supabase SQL Editor
8. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

### What Gets Created

The script creates:
- ✅ All necessary tables (users, calendar_events, user_preferences, chat_messages, dashboard_stats)
- ✅ All indexes for performance
- ✅ All RLS policies
- ✅ Storage bucket for profile pictures
- ✅ Storage policies
- ✅ Triggers for updated_at timestamps

### Verify Setup

After running, check:
1. Go to **Table Editor** - you should see 5 tables
2. Go to **Storage** - you should see `profile-pictures` bucket
3. You should see a success message in the SQL Editor

**Note:** This script is idempotent - safe to run multiple times. It will skip existing tables and update policies.

**For detailed instructions, see `SETUP_DATABASE.md`**

## 4. Storage Bucket

**The storage bucket is automatically created by the `complete-setup.sql` script.**

If you need to create it manually:
1. Go to Storage in your Supabase dashboard
2. Click "Create Bucket"
3. Configure:
   - **Bucket name:** `profile-pictures`
   - **Public bucket:** Yes (toggle ON)
   - **File size limit:** 5MB
   - **Allowed MIME types:** `image/png, image/jpeg, image/jpg, image/webp`
4. Click "Create bucket"

**Note:** The `complete-setup.sql` script includes storage bucket creation and all policies, so manual setup is not required.

## 5. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen:
   - User Type: External
   - App name: Your App Name
   - Authorized domains: Add your domain
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: 
     - `https://your-project.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local development)
     - `https://your-vercel-app.vercel.app/auth/callback` (for production/Vercel)
7. Copy the Client ID and Client Secret

8. In Supabase Dashboard:
   - Go to Authentication → Providers
   - Enable Google provider
   - Enter your Google Client ID and Client Secret
   - **Important:** Go to Authentication → URL Configuration
   - Add your redirect URLs:
     - `http://localhost:3000/auth/callback` (for local development)
     - `https://your-vercel-app.vercel.app/auth/callback` (for production/Vercel)
   - Save

## 6. Configure Environment Variables

1. Create `.env.local` file
2. Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
   ```
   **Note:** `NEXT_PUBLIC_APP_URL` is optional - if not set, it will use `window.location.origin` automatically. Set it in Vercel environment variables for production.

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Try signing up a new user
3. Check your Supabase dashboard to verify:
   - User appears in Authentication > Users
   - User profile appears in Table Editor > users
   - Dashboard stats are initialized

## API Endpoints

All API endpoints require authentication (except signup/signin):

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in

### Calendar
- `GET /api/calendar/events` - Get events (query params: start, end)
- `POST /api/calendar/events` - Create event
- `PUT /api/calendar/events/[id]` - Update event
- `DELETE /api/calendar/events/[id]` - Delete event

### Preferences
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Save preferences

### Chat
- `POST /api/chat` - Send message to OpenAI
- `GET /api/chat/history` - Get chat history

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `PUT /api/dashboard/stats` - Update dashboard statistics

## Authentication

All protected endpoints require an Authorization header:
```
Authorization: Bearer <token>
```

The token is stored in localStorage after signin as `supabase_token`.

## Troubleshooting

### "Row Level Security" errors (403 Unauthorized)
- Make sure you've run the `supabase/schema.sql` file
- **Run `scripts/fix-rls-policies.sql` to fix missing INSERT policies**
- Check that RLS policies are enabled in Supabase dashboard
- Verify the `users` table has INSERT, SELECT, and UPDATE policies

### Storage upload errors
- Verify the `profile-pictures` bucket exists
- Check bucket policies in Storage settings

### API authentication errors
- Ensure you're sending the Authorization header
- Verify the token is valid (check localStorage)
- Token expires after 1 hour by default

