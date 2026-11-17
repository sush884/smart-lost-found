-- ============================================================================
-- SUPABASE STORAGE CONFIGURATION
-- Private bucket for item photos and evidence
-- ============================================================================

-- 1. Create the private bucket 'item-images' if it doesn't already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'item-images',
    'item-images',
    FALSE, -- Private bucket! Requires signed URLs or service role
    5242880, -- 5 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    public = FALSE,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

-- 2. Storage RLS Policies
-- Allow authenticated users to upload files into their user folder or reports folder
CREATE POLICY "Authenticated users can upload item images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'item-images');

-- Allow authenticated users to view item images (or generate signed URLs)
CREATE POLICY "Authenticated users can view item images"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'item-images');

-- Allow owners or staff to delete image objects
CREATE POLICY "Users can update or delete their uploaded images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);
