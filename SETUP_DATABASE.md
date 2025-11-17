# Database Setup Instructions

## Quick Start - Create All Database Tables

**Follow these steps to set up your Supabase database:**

### Step 1: Open Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Complete Setup Script

1. Open the file `supabase/complete-setup.sql` in your project
2. **Copy the ENTIRE contents** of the file
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

### Step 3: Verify Setup

After running the script, you should see:
- ✅ Success message: "Setup completed successfully!"
- ✅ All tables created in the **Table Editor**
- ✅ Storage bucket `profile-pictures` created in **Storage**

### What Gets Created

The script creates:

#### Tables:
- ✅ `public.users` - User profiles
- ✅ `public.calendar_events` - Calendar events
- ✅ `public.user_preferences` - User preferences
- ✅ `public.chat_messages` - Chat messages
- ✅ `public.dashboard_stats` - Dashboard statistics

#### Security:
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ RLS policies for all tables
- ✅ Storage policies for profile pictures

#### Storage:
- ✅ `profile-pictures` bucket (public, 5MB limit)

#### Other:
- ✅ Indexes for performance
- ✅ Triggers for `updated_at` timestamps

### Troubleshooting

**If you get errors:**

1. **"relation already exists"** - Tables already exist, this is fine. The script uses `CREATE TABLE IF NOT EXISTS`.

2. **"permission denied"** - Make sure you're using the SQL Editor with proper permissions.

3. **"extension uuid-ossp does not exist"** - This should be automatically created, but if not, run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

4. **Storage bucket errors** - If the bucket creation fails, you can create it manually:
   - Go to **Storage** → **Create Bucket**
   - Name: `profile-pictures`
   - Public: Yes
   - File size limit: 5MB

### Alternative: Run Scripts Separately

If you prefer to run scripts separately:

1. **First, create tables:**
   - Run `supabase/schema.sql` (creates tables, indexes, RLS)

2. **Then, create storage:**
   - Run `scripts/create-storage-bucket.sql` (creates bucket and policies)

3. **If needed, fix policies:**
   - Run `scripts/fix-rls-policies.sql` (fixes any RLS issues)

### Verify Tables Exist

After running the script, check:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see these tables:
   - `users`
   - `calendar_events`
   - `user_preferences`
   - `chat_messages`
   - `dashboard_stats`

3. Go to **Storage** in Supabase Dashboard
4. You should see the `profile-pictures` bucket

### Next Steps

After the database is set up:

1. ✅ Configure environment variables (`.env.local`)
2. ✅ Test signup/signin
3. ✅ Verify profile picture uploads work

---

**Note:** The `complete-setup.sql` script is **idempotent** - you can run it multiple times safely. It will skip existing tables and update policies.

