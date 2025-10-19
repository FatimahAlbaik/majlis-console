-- Majlis Console Storage Policies
-- Media storage configuration and policies

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
('media', 'media', true, 20971520, ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/webm',
    'application/pdf'
]);

-- Storage policies for media bucket
-- Allow public read access
CREATE POLICY "Public access to media" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'media');

-- Allow authenticated users to upload media
CREATE POLICY "Authenticated users can upload media" 
    ON storage.objects FOR INSERT 
    WITH CHECK (
        bucket_id = 'media' 
        AND auth.role() = 'authenticated'
    );

-- Allow users to update their own media
CREATE POLICY "Users can update own media" 
    ON storage.objects FOR UPDATE 
    USING (
        bucket_id = 'media' 
        AND auth.uid() = (storage.foldername(name))[1]
    )
    WITH CHECK (
        bucket_id = 'media' 
        AND auth.uid() = (storage.foldername(name))[1]
    );

-- Allow users to delete their own media
CREATE POLICY "Users can delete own media" 
    ON storage.objects FOR DELETE 
    USING (
        bucket_id = 'media' 
        AND auth.uid() = (storage.foldername(name))[1]
    );

-- Allow admins to delete any media
CREATE POLICY "Admins can delete any media" 
    ON storage.objects FOR DELETE 
    USING (
        bucket_id = 'media' 
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- File size validation function
CREATE OR REPLACE FUNCTION validate_file_size()
RETURNS TRIGGER AS $$
DECLARE
    file_size_mb NUMERIC;
    file_type TEXT;
BEGIN
    file_size_mb := NEW.metadata->>'size';
    file_type := NEW.metadata->>'mimetype';
    
    -- Image size limit: 3MB
    IF file_type LIKE 'image/%' AND file_size_mb > 3145728 THEN
        RAISE EXCEPTION 'Image files must be less than 3MB';
    END IF;
    
    -- Video size limit: 20MB
    IF file_type LIKE 'video/%' AND file_size_mb > 20971520 THEN
        RAISE EXCEPTION 'Video files must be less than 20MB';
    END IF;
    
    -- PDF size limit: 10MB
    IF file_type = 'application/pdf' AND file_size_mb > 10485760 THEN
        RAISE EXCEPTION 'PDF files must be less than 10MB';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for file size validation
CREATE TRIGGER validate_file_size_trigger
    BEFORE INSERT ON storage.objects
    FOR EACH ROW
    EXECUTE FUNCTION validate_file_size();

-- Function to generate organized file paths
CREATE OR REPLACE FUNCTION generate_media_path()
RETURNS TEXT AS $$
DECLARE
    user_id TEXT;
    timestamp TEXT;
    random_suffix TEXT;
BEGIN
    user_id := auth.uid()::TEXT;
    timestamp := TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');
    random_suffix := SUBSTR(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 8);
    
    RETURN user_id || '/' || timestamp || '_' || random_suffix;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up orphaned media files
CREATE OR REPLACE FUNCTION cleanup_orphaned_media()
RETURNS VOID AS $$
BEGIN
    DELETE FROM storage.objects 
    WHERE bucket_id = 'media' 
    AND name NOT IN (
        SELECT url FROM post_media 
        UNION 
        SELECT url FROM activity_media
    )
    AND created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Create index for better performance
CREATE INDEX idx_storage_objects_bucket_id ON storage.objects(bucket_id);
CREATE INDEX idx_storage_objects_name ON storage.objects(name);
CREATE INDEX idx_storage_objects_created_at ON storage.objects(created_at);

-- View for media statistics
CREATE OR REPLACE VIEW media_statistics AS
SELECT 
    bucket_id,
    COUNT(*) as total_files,
    SUM((metadata->>'size')::BIGINT) as total_size_bytes,
    AVG((metadata->>'size')::BIGINT) as avg_size_bytes,
    MIN(created_at) as oldest_file,
    MAX(created_at) as newest_file
FROM storage.objects 
WHERE bucket_id = 'media'
GROUP BY bucket_id;