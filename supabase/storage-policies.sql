-- STORAGE SETUP (owner-safe for Supabase)

-- Extensions (safe/idempotent)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1) BUCKET ---------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  20971520, -- 20 MB global bucket cap (separate per-type limits enforced via policy below)
  ARRAY[
    'image/jpeg','image/png','image/gif','image/webp','image/svg+xml',
    'video/mp4','video/mpeg','video/quicktime','video/webm',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 2) POLICIES (create-only; unique names, no drops, no alters) --------------
-- NOTE: We cannot ALTER TABLE or DROP POLICY on storage.objects because we don't own it.
-- So we only CREATE policies with distinct names.

-- Public read for 'media' bucket
CREATE POLICY app_media_public_read
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Authenticated insert with in-policy file-size validation (no trigger needed)
-- Owner is assumed to prefix key with "<auth.uid()>/..."
CREATE POLICY app_media_insert_with_size_check
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media'
  AND auth.role() = 'authenticated'
  AND (
    -- allow if SDK didn't include size/mimetype (client may set later)
    NOT (metadata ? 'mimetype') OR NOT (metadata ? 'size')
    OR (
      -- otherwise enforce per-type size ceilings
      (
        (metadata->>'mimetype') LIKE 'image/%'
        AND NULLIF(metadata->>'size','')::bigint <= 3*1024*1024
      ) OR (
        (metadata->>'mimetype') LIKE 'video/%'
        AND NULLIF(metadata->>'size','')::bigint <= 20*1024*1024
      ) OR (
        (metadata->>'mimetype') = 'application/pdf'
        AND NULLIF(metadata->>'size','')::bigint <= 10*1024*1024
      )
    )
  )
);

-- Update only by the owner (first path segment is the owner uuid)
CREATE POLICY app_media_update_own
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media'
  AND auth.uid() = substring(name from '^[^/]+')::uuid
)
WITH CHECK (
  bucket_id = 'media'
  AND auth.uid() = substring(name from '^[^/]+')::uuid
);

-- Delete only by the owner
CREATE POLICY app_media_delete_own
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media'
  AND auth.uid() = substring(name from '^[^/]+')::uuid
);

-- Admins can delete any object in 'media'
CREATE POLICY app_media_delete_any_admin
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media'
  AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- 3) OPTIONAL HELPERS (no privileges needed on storage.objects) -------------
-- Random file path generator
CREATE OR REPLACE FUNCTION public.generate_media_path()
RETURNS TEXT AS $$
BEGIN
  RETURN auth.uid()::TEXT || '/' ||
         TO_CHAR(NOW(),'YYYYMMDDHH24MISS') || '_' ||
         SUBSTR(REPLACE(gen_random_uuid()::TEXT,'-',''),1,8);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Orphan cleanup utility (does not touch storage.objects structure)
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_media()
RETURNS VOID AS $$
BEGIN
  DELETE FROM storage.objects o
  WHERE  o.bucket_id = 'media'
    AND  o.created_at < NOW() - INTERVAL '1 hour'
    AND  NOT EXISTS (SELECT 1 FROM public.post_media     pm WHERE pm.url = o.name)
    AND  NOT EXISTS (SELECT 1 FROM public.activity_media am WHERE am.url = o.name);
END;
$$ LANGUAGE plpgsql;

-- 4) OPTIONAL: stats view (read-only; safe)
CREATE OR REPLACE VIEW public.media_statistics AS
SELECT bucket_id,
       COUNT(*)                                             AS total_files,
       COALESCE(SUM((metadata->>'size')::BIGINT),0)         AS total_size_bytes,
       COALESCE(AVG((metadata->>'size')::BIGINT),0)::BIGINT AS avg_size_bytes,
       MIN(created_at)                                      AS oldest_file,
       MAX(created_at)                                      AS newest_file
FROM   storage.objects
WHERE  bucket_id = 'media'
GROUP  BY bucket_id;
