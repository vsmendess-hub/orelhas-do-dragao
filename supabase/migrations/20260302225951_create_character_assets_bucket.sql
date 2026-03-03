-- Create storage bucket for character assets (avatars, etc)
INSERT INTO storage.buckets (id, name, public)
VALUES ('character-assets', 'character-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for character assets
CREATE POLICY "Users can upload their own character assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'character-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view all character assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'character-assets');

CREATE POLICY "Users can update their own character assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'character-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own character assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'character-assets' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
