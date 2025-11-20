# Database Setup

## Structure

The database uses a clean reference structure:

```
auth.users (Supabase Auth - separate, managed by Supabase)
    ↓ (referenced by)
public.users (extends auth.users with profile data)
    ↓ (referenced by)
public.user_preferences (stores /preferences form data)
public.smartadmit_data (stores smartadmit form data)
```

### Tables

1. **`auth.users`** - Managed by Supabase Auth (separate, you don't create this)
2. **`public.users`** - Extends auth.users with profile info (references `auth.users(id)`)
3. **`public.user_preferences`** - Stores preferences data (references `public.users(id)`)
4. **`public.smartadmit_data`** - Stores smartadmit data (references `public.users(id)`)

## How to Run

### ✅ Correct Way: SQL Editor

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy and paste the entire contents of `schema.sql`
5. Click **Run** (or press Ctrl+Enter)

**Expected Result:** "Success. No rows returned" ✅ (This is normal for CREATE TABLE statements)

### ❌ NOT in Storage Buckets

- **Storage buckets** are for files (images, documents)
- **SQL schema** is for database tables
- These are completely separate!

### Storage Buckets (Optional - for file uploads)

If you need to store files (like profile pictures, college logos), create buckets in:
- Supabase Dashboard → **Storage** → Create Bucket

Example buckets you might need:
- `profile-pictures` - for user profile photos
- `college` - for college-related files (if needed)

## Verify Setup

After running the SQL, verify tables were created:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see these tables:
   - `users`
   - `user_preferences`
   - `smartadmit_data`

## Notes

- The SQL file is **idempotent** - safe to run multiple times
- "Success. No rows returned" is normal - DDL statements don't return rows
- Auth users are kept separate in `auth.users` schema (managed by Supabase)
- All user data tables reference `public.users` which references `auth.users`
