-- Run this SQL in your Supabase SQL Editor to create the storage bucket
-- Or use the Supabase Dashboard: Storage > Create Bucket

-- Create the bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures',
  'profile-pictures',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies - Allow public access for profile pictures
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can upload profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile picture" ON storage.objects;

-- Create new policies that allow public access
CREATE POLICY "Anyone can upload profile pictures"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-pictures');

CREATE POLICY "Anyone can view profile pictures"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-pictures');

CREATE POLICY "Anyone can update profile pictures"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'profile-pictures');

CREATE POLICY "Anyone can delete profile pictures"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'profile-pictures');

