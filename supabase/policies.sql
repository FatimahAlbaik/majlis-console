-- ENABLE RLS ON ALL APP TABLES ------------------------------------------------
ALTER TABLE cohorts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams          ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_media       ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_media   ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback         ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE news             ENABLE ROW LEVEL SECURITY;
ALTER TABLE links            ENABLE ROW LEVEL SECURITY;
ALTER TABLE important_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;

-- HELPERS (SECURITY DEFINER; pin search_path for safety) ----------------------
CREATE OR REPLACE FUNCTION public.get_user_cohort()
RETURNS UUID AS $$
DECLARE cid UUID;
BEGIN
  SET LOCAL search_path = public, auth, storage, extensions;
  SELECT cohort_id INTO cid FROM public.users WHERE id = auth.uid();
  IF cid IS NULL THEN RAISE EXCEPTION 'User cohort not set'; END IF;
  RETURN cid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  SET LOCAL search_path = public, auth, storage, extensions;
  RETURN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_fellow()
RETURNS BOOLEAN AS $$
BEGIN
  SET LOCAL search_path = public, auth, storage, extensions;
  RETURN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'fellow');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_stream()
RETURNS UUID AS $$
DECLARE sid UUID;
BEGIN
  SET LOCAL search_path = public, auth, storage, extensions;
  SELECT stream_id INTO sid FROM public.users WHERE id = auth.uid();
  RETURN sid; -- may be NULL (org-wide visibility)
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- USERS -----------------------------------------------------------------------
DROP POLICY IF EXISTS users_select_same_cohort ON users;
CREATE POLICY users_select_same_cohort ON users FOR SELECT
USING (cohort_id = public.get_user_cohort() AND is_active = TRUE);

DROP POLICY IF EXISTS users_update_own ON users;
CREATE POLICY users_update_own ON users FOR UPDATE
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS users_update_any ON users;
CREATE POLICY users_update_any ON users FOR UPDATE
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- POSTS -----------------------------------------------------------------------
DROP POLICY IF EXISTS posts_select_same_cohort ON posts;
CREATE POLICY posts_select_same_cohort ON posts FOR SELECT
USING (
  cohort_id = public.get_user_cohort()
  AND (visibility = 'org' OR (visibility = 'stream' AND stream_id = public.get_user_stream()))
);

DROP POLICY IF EXISTS posts_insert_auth ON posts;
CREATE POLICY posts_insert_auth ON posts FOR INSERT
WITH CHECK (author_id = auth.uid() AND cohort_id = public.get_user_cohort());

DROP POLICY IF EXISTS posts_update_own ON posts;
CREATE POLICY posts_update_own ON posts FOR UPDATE
USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS posts_delete_own ON posts;
CREATE POLICY posts_delete_own ON posts FOR DELETE
USING (author_id = auth.uid());

DROP POLICY IF EXISTS posts_delete_any ON posts;
CREATE POLICY posts_delete_any ON posts FOR DELETE
USING (public.is_admin());

-- COMMENTS --------------------------------------------------------------------
DROP POLICY IF EXISTS comments_select_same_cohort ON comments;
CREATE POLICY comments_select_same_cohort ON comments FOR SELECT
USING (cohort_id = public.get_user_cohort());

DROP POLICY IF EXISTS comments_insert_auth ON comments;
CREATE POLICY comments_insert_auth ON comments FOR INSERT
WITH CHECK (author_id = auth.uid() AND cohort_id = public.get_user_cohort());

DROP POLICY IF EXISTS comments_delete_own ON comments;
CREATE POLICY comments_delete_own ON comments FOR DELETE
USING (author_id = auth.uid());

DROP POLICY IF EXISTS comments_delete_any ON comments;
CREATE POLICY comments_delete_any ON comments FOR DELETE
USING (public.is_admin());

-- REACTIONS -------------------------------------------------------------------
DROP POLICY IF EXISTS reactions_select_same_cohort ON reactions;
CREATE POLICY reactions_select_same_cohort ON reactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = reactions.post_id
      AND posts.cohort_id = public.get_user_cohort()
  )
);

DROP POLICY IF EXISTS reactions_insert_auth ON reactions;
CREATE POLICY reactions_insert_auth ON reactions FOR INSERT
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS reactions_delete_own ON reactions;
CREATE POLICY reactions_delete_own ON reactions FOR DELETE
USING (user_id = auth.uid());

-- ACTIVITIES ------------------------------------------------------------------
DROP POLICY IF EXISTS activities_select_same_cohort ON activities;
CREATE POLICY activities_select_same_cohort ON activities FOR SELECT
USING (cohort_id = public.get_user_cohort());

DROP POLICY IF EXISTS activities_insert_fellow_admin ON activities;
CREATE POLICY activities_insert_fellow_admin ON activities FOR INSERT
WITH CHECK ((public.is_fellow() OR public.is_admin()) AND cohort_id = public.get_user_cohort());

DROP POLICY IF EXISTS activities_update_fellow_admin ON activities;
CREATE POLICY activities_update_fellow_admin ON activities FOR UPDATE
USING (public.is_fellow() OR public.is_admin())
WITH CHECK (public.is_fellow() OR public.is_admin());

DROP POLICY IF EXISTS activities_delete_fellow_admin ON activities;
CREATE POLICY activities_delete_fellow_admin ON activities FOR DELETE
USING (public.is_fellow() OR public.is_admin());

-- ACTIVITY_MEDIA --------------------------------------------------------------
DROP POLICY IF EXISTS activity_media_select_same_cohort ON activity_media;
CREATE POLICY activity_media_select_same_cohort ON activity_media FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM activities
    WHERE activities.id = activity_media.activity_id
      AND activities.cohort_id = public.get_user_cohort()
  )
);

DROP POLICY IF EXISTS activity_media_insert_fellow_admin ON activity_media;
CREATE POLICY activity_media_insert_fellow_admin ON activity_media FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM activities
    WHERE activities.id = activity_media.activity_id
      AND activities.cohort_id = public.get_user_cohort()
  ) AND (public.is_fellow() OR public.is_admin())
);

DROP POLICY IF EXISTS activity_media_delete_fellow_admin ON activity_media;
CREATE POLICY activity_media_delete_fellow_admin ON activity_media FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM activities
    WHERE activities.id = activity_media.activity_id
      AND activities.cohort_id = public.get_user_cohort()
  ) AND (public.is_fellow() OR public.is_admin())
);

-- SUGGESTIONS -----------------------------------------------------------------
DROP POLICY IF EXISTS suggestions_select_same_cohort ON suggestions;
CREATE POLICY suggestions_select_same_cohort ON suggestions FOR SELECT
USING (cohort_id = public.get_user_cohort());

DROP POLICY IF EXISTS suggestions_insert_auth ON suggestions;
CREATE POLICY suggestions_insert_auth ON suggestions FOR INSERT
WITH CHECK (author_id = auth.uid() AND cohort_id = public.get_user_cohort());

DROP POLICY IF EXISTS suggestions_update_own ON suggestions;
CREATE POLICY suggestions_update_own ON suggestions FOR UPDATE
USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS suggestions_update_status ON suggestions;
CREATE POLICY suggestions_update_status ON suggestions FOR UPDATE
USING (public.is_fellow() OR public.is_admin())
WITH CHECK (public.is_fellow() OR public.is_admin());

-- FEEDBACK --------------------------------------------------------------------
DROP POLICY IF EXISTS feedback_select_own_or_admin ON feedback;
CREATE POLICY feedback_select_own_or_admin ON feedback FOR SELECT
USING (sender_id = auth.uid() OR recipient_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS feedback_insert_auth ON feedback;
CREATE POLICY feedback_insert_auth ON feedback FOR INSERT
WITH CHECK (sender_id = auth.uid() AND cohort_id = public.get_user_cohort());

-- ANNOUNCEMENTS ---------------------------------------------------------------
DROP POLICY IF EXISTS announcements_select_same_cohort ON announcements;
CREATE POLICY announcements_select_same_cohort ON announcements FOR SELECT
USING (cohort_id = public.get_user_cohort());

DROP POLICY IF EXISTS announcements_insert_fellow_admin ON announcements;
CREATE POLICY announcements_insert_fellow_admin ON announcements FOR INSERT
WITH CHECK ((public.is_fellow() OR public.is_admin()) AND cohort_id = public.get_user_cohort());

DROP POLICY IF EXISTS announcements_update_fellow_admin ON announcements;
CREATE POLICY announcements_update_fellow_admin ON announcements FOR UPDATE
USING (public.is_fellow() OR public.is_admin())
WITH CHECK (public.is_fellow() OR public.is_admin());

DROP POLICY IF EXISTS announcements_delete_fellow_admin ON announcements;
CREATE POLICY announcements_delete_fellow_admin ON announcements FOR DELETE
USING (public.is_fellow() OR public.is_admin());

-- NEWS ------------------------------------------------------------------------
DROP POLICY IF EXISTS news_select_same_cohort ON news;
CREATE POLICY news_select_same_cohort ON news FOR SELECT
USING (cohort_id = public.get_user_cohort());

DROP POLICY IF EXISTS news_insert_fellow_admin ON news;
CREATE POLICY news_insert_fellow_admin ON news FOR INSERT
WITH CHECK ((public.is_fellow() OR public.is_admin()) AND cohort_id = public.get_user_cohort());

DROP POLICY IF EXISTS news_update_fellow_admin ON news;
CREATE POLICY news_update_fellow_admin ON news FOR UPDATE
USING (public.is_fellow() OR public.is_admin())
WITH CHECK (public.is_fellow() OR public.is_admin());

-- LINKS -----------------------------------------------------------------------
DROP POLICY IF EXISTS links_select_same_cohort ON links;
CREATE POLICY links_select_same_cohort ON links FOR SELECT
USING (cohort_id = public.get_user_cohort());

DROP POLICY IF EXISTS links_insert_auth ON links;
CREATE POLICY links_insert_auth ON links FOR INSERT
WITH CHECK (author_id = auth.uid() AND cohort_id = public.get_user_cohort());

DROP POLICY IF EXISTS links_update_own ON links;
CREATE POLICY links_update_own ON links FOR UPDATE
USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS links_update_any ON links;
CREATE POLICY links_update_any ON links FOR UPDATE
USING (public.is_fellow() OR public.is_admin())
WITH CHECK (public.is_fellow() OR public.is_admin());

-- IMPORTANT_EMAILS ------------------------------------------------------------
DROP POLICY IF EXISTS important_emails_select_same_cohort ON important_emails;
CREATE POLICY important_emails_select_same_cohort ON important_emails FOR SELECT
USING (cohort_id = public.get_user_cohort());

DROP POLICY IF EXISTS important_emails_insert_fellow_admin ON important_emails;
CREATE POLICY important_emails_insert_fellow_admin ON important_emails FOR INSERT
WITH CHECK ((public.is_fellow() OR public.is_admin()) AND cohort_id = public.get_user_cohort());

-- NOTIFICATIONS ----------------------------------------------------------------
DROP POLICY IF EXISTS notifications_select_own ON notifications;
CREATE POLICY notifications_select_own ON notifications FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS notifications_update_own ON notifications;
CREATE POLICY notifications_update_own ON notifications FOR UPDATE
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- POST_MEDIA -------------------------------------------------------------------
DROP POLICY IF EXISTS post_media_select_same_cohort ON post_media;
CREATE POLICY post_media_select_same_cohort ON post_media FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_media.post_id
      AND posts.cohort_id = public.get_user_cohort()
  )
);

DROP POLICY IF EXISTS post_media_insert_own_post ON post_media;
CREATE POLICY post_media_insert_own_post ON post_media FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_media.post_id
      AND posts.author_id = auth.uid()
  )
);

-- COHORTS / STREAMS / WEEKS (read-only to user) --------------------------------
DROP POLICY IF EXISTS cohorts_select_own ON cohorts;
CREATE POLICY cohorts_select_own ON cohorts FOR SELECT
USING (id = public.get_user_cohort());

DROP POLICY IF EXISTS streams_select_all ON streams;
CREATE POLICY streams_select_all ON streams FOR SELECT
USING (true);

DROP POLICY IF EXISTS weeks_select_same_cohort ON weeks;
CREATE POLICY weeks_select_same_cohort ON weeks FOR SELECT
USING (cohort_id = public.get_user_cohort());
