-- Majlis Console RLS Policies
-- Row Level Security for cohort-scoped access

-- Enable RLS on all tables
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE important_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's cohort
CREATE OR REPLACE FUNCTION get_user_cohort()
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT cohort_id FROM users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT role = 'admin' FROM users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is fellow
CREATE OR REPLACE FUNCTION is_fellow()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT role = 'fellow' FROM users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get user's stream
CREATE OR REPLACE FUNCTION get_user_stream()
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT stream_id FROM users WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users policies
CREATE POLICY "Users can view users in same cohort"
    ON users FOR SELECT
    USING (cohort_id = get_user_cohort() AND is_active = TRUE);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can update any user"
    ON users FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- Posts policies
CREATE POLICY "Users can view posts in same cohort"
    ON posts FOR SELECT
    USING (
        cohort_id = get_user_cohort() 
        AND (
            visibility = 'org' 
            OR (visibility = 'stream' AND stream_id = get_user_stream())
        )
    );

CREATE POLICY "Authenticated users can create posts"
    ON posts FOR INSERT
    WITH CHECK (
        author_id = auth.uid() 
        AND cohort_id = get_user_cohort()
    );

CREATE POLICY "Authors can update their own posts"
    ON posts FOR UPDATE
    USING (author_id = auth.uid())
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can delete their own posts"
    ON posts FOR DELETE
    USING (author_id = auth.uid());

CREATE POLICY "Admins can delete any post"
    ON posts FOR DELETE
    USING (is_admin());

-- Comments policies
CREATE POLICY "Users can view comments in same cohort"
    ON comments FOR SELECT
    USING (cohort_id = get_user_cohort());

CREATE POLICY "Authenticated users can create comments"
    ON comments FOR INSERT
    WITH CHECK (
        author_id = auth.uid() 
        AND cohort_id = get_user_cohort()
    );

CREATE POLICY "Authors can delete their own comments"
    ON comments FOR DELETE
    USING (author_id = auth.uid());

CREATE POLICY "Admins can delete any comment"
    ON comments FOR DELETE
    USING (is_admin());

-- Reactions policies
CREATE POLICY "Users can view reactions in same cohort"
    ON reactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM posts 
            WHERE posts.id = reactions.post_id 
            AND posts.cohort_id = get_user_cohort()
        )
    );

CREATE POLICY "Authenticated users can add reactions"
    ON reactions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their own reactions"
    ON reactions FOR DELETE
    USING (user_id = auth.uid());

-- Activities policies
CREATE POLICY "Users can view activities in same cohort"
    ON activities FOR SELECT
    USING (cohort_id = get_user_cohort());

CREATE POLICY "Fellows and admins can create activities"
    ON activities FOR INSERT
    WITH CHECK (
        (is_fellow() OR is_admin()) 
        AND cohort_id = get_user_cohort()
    );

CREATE POLICY "Fellows and admins can update activities"
    ON activities FOR UPDATE
    USING (is_fellow() OR is_admin())
    WITH CHECK (is_fellow() OR is_admin());

CREATE POLICY "Fellows and admins can delete activities"
    ON activities FOR DELETE
    USING (is_fellow() OR is_admin());

-- Suggestions policies
CREATE POLICY "Users can view suggestions in same cohort"
    ON suggestions FOR SELECT
    USING (cohort_id = get_user_cohort());

CREATE POLICY "Authenticated users can create suggestions"
    ON suggestions FOR INSERT
    WITH CHECK (
        author_id = auth.uid() 
        AND cohort_id = get_user_cohort()
    );

CREATE POLICY "Authors can update their own suggestions"
    ON suggestions FOR UPDATE
    USING (author_id = auth.uid())
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Fellows and admins can update suggestion status"
    ON suggestions FOR UPDATE
    USING (is_fellow() OR is_admin())
    WITH CHECK (is_fellow() OR is_admin());

-- Feedback policies
CREATE POLICY "Users can view their own feedback"
    ON feedback FOR SELECT
    USING (
        sender_id = auth.uid() 
        OR recipient_id = auth.uid() 
        OR is_admin()
    );

CREATE POLICY "Authenticated users can create feedback"
    ON feedback FOR INSERT
    WITH CHECK (
        sender_id = auth.uid() 
        AND cohort_id = get_user_cohort()
    );

CREATE POLICY "Admins can view all feedback"
    ON feedback FOR SELECT
    USING (is_admin());

-- Announcements policies
CREATE POLICY "Users can view announcements in same cohort"
    ON announcements FOR SELECT
    USING (cohort_id = get_user_cohort());

CREATE POLICY "Fellows and admins can create announcements"
    ON announcements FOR INSERT
    WITH CHECK (
        (is_fellow() OR is_admin()) 
        AND cohort_id = get_user_cohort()
    );

CREATE POLICY "Fellows and admins can update announcements"
    ON announcements FOR UPDATE
    USING (is_fellow() OR is_admin())
    WITH CHECK (is_fellow() OR is_admin());

CREATE POLICY "Fellows and admins can delete announcements"
    ON announcements FOR DELETE
    USING (is_fellow() OR is_admin());

-- News policies
CREATE POLICY "Users can view news in same cohort"
    ON news FOR SELECT
    USING (cohort_id = get_user_cohort());

CREATE POLICY "Fellows and admins can create news"
    ON news FOR INSERT
    WITH CHECK (
        (is_fellow() OR is_admin()) 
        AND cohort_id = get_user_cohort()
    );

CREATE POLICY "Fellows and admins can update news"
    ON news FOR UPDATE
    USING (is_fellow() OR is_admin())
    WITH CHECK (is_fellow() OR is_admin());

-- Links policies
CREATE POLICY "Users can view links in same cohort"
    ON links FOR SELECT
    USING (cohort_id = get_user_cohort());

CREATE POLICY "Authenticated users can create links"
    ON links FOR INSERT
    WITH CHECK (
        author_id = auth.uid() 
        AND cohort_id = get_user_cohort()
    );

CREATE POLICY "Authors can update their own links"
    ON links FOR UPDATE
    USING (author_id = auth.uid())
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Fellows and admins can update any link"
    ON links FOR UPDATE
    USING (is_fellow() OR is_admin())
    WITH CHECK (is_fellow() OR is_admin());

-- Important emails policies
CREATE POLICY "Users can view important emails in same cohort"
    ON important_emails FOR SELECT
    USING (cohort_id = get_user_cohort());

CREATE POLICY "Fellows and admins can add important emails"
    ON important_emails FOR INSERT
    WITH CHECK (
        (is_fellow() OR is_admin()) 
        AND cohort_id = get_user_cohort()
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Media tables policies (post_media, activity_media)
CREATE POLICY "Users can view media in same cohort"
    ON post_media FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM posts 
            WHERE posts.id = post_media.post_id 
            AND posts.cohort_id = get_user_cohort()
        )
    );

CREATE POLICY "Authenticated users can add media to their posts"
    ON post_media FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM posts 
            WHERE posts.id = post_media.post_id 
            AND posts.author_id = auth.uid()
        )
    );

CREATE POLICY "Users can view activity media in same cohort"
    ON activity_media FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM activities 
            WHERE activities.id = activity_media.activity_id 
            AND activities.cohort_id = get_user_cohort()
        )
    );

-- Cohorts and streams (read-only for users)
CREATE POLICY "Users can view their cohort"
    ON cohorts FOR SELECT
    USING (id = get_user_cohort());

CREATE POLICY "Users can view all streams"
    ON streams FOR SELECT
    USING (true);

CREATE POLICY "Users can view weeks in their cohort"
    ON weeks FOR SELECT
    USING (cohort_id = get_user_cohort());