-- Majlis Console Database Schema
-- Accenture Academy Cohort 6 Portal

-- Extensions needed:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

-- COHORTS
CREATE TABLE IF NOT EXISTS cohorts (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    start_date  DATE,
    end_date    DATE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- STREAMS
CREATE TABLE IF NOT EXISTS streams (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- WEEKS
CREATE TABLE IF NOT EXISTS weeks (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number      INT NOT NULL,
    title       VARCHAR(200) NOT NULL,
    start_date  DATE,
    end_date    DATE,
    cohort_id   UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- USERS (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email       VARCHAR(255) UNIQUE NOT NULL,
    full_name   VARCHAR(200) NOT NULL,
    role        VARCHAR(20) NOT NULL CHECK (role IN ('admin','fellow','member')),
    stream_id   UUID REFERENCES streams(id),
    cohort_id   UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    avatar_url  TEXT,
    bio         TEXT,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- POSTS
CREATE TABLE IF NOT EXISTS posts (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content     TEXT NOT NULL,
    author_id   UUID REFERENCES users(id) ON DELETE CASCADE,
    stream_id   UUID REFERENCES streams(id),
    cohort_id   UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    week_id     UUID REFERENCES weeks(id),
    visibility  VARCHAR(20) DEFAULT 'org' CHECK (visibility IN ('org','stream')),
    is_pinned   BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- POST_MEDIA
CREATE TABLE IF NOT EXISTS post_media (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id     UUID REFERENCES posts(id) ON DELETE CASCADE,
    url         TEXT NOT NULL,
    type        VARCHAR(20) NOT NULL CHECK (type IN ('image','video','pdf')),
    filename    VARCHAR(255),
    size_bytes  INT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- COMMENTS
CREATE TABLE IF NOT EXISTS comments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content     TEXT NOT NULL,
    post_id     UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_id   UUID REFERENCES users(id) ON DELETE CASCADE,
    cohort_id   UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- REACTIONS
CREATE TABLE IF NOT EXISTS reactions (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id       UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(10) NOT NULL CHECK (reaction_type IN ('👍','👏','❤️')),
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (post_id, user_id, reaction_type)
);

-- ACTIVITIES
CREATE TABLE IF NOT EXISTS activities (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    holder        VARCHAR(200),
    week_id       UUID REFERENCES weeks(id),
    stream_id     UUID REFERENCES streams(id),
    cohort_id     UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    activity_date TIMESTAMPTZ,
    location      VARCHAR(200),
    activity_type VARCHAR(50) DEFAULT 'general',
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ACTIVITY_MEDIA
CREATE TABLE IF NOT EXISTS activity_media (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id  UUID REFERENCES activities(id) ON DELETE CASCADE,
    url          TEXT NOT NULL,
    type         VARCHAR(20) NOT NULL CHECK (type IN ('image','video','pdf')),
    filename     VARCHAR(255),
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- SUGGESTIONS
CREATE TABLE IF NOT EXISTS suggestions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category    VARCHAR(100),
    author_id   UUID REFERENCES users(id) ON DELETE CASCADE,
    cohort_id   UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    status      VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','in-review','resolved')),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- FEEDBACK
CREATE TABLE IF NOT EXISTS feedback (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content      TEXT NOT NULL,
    sender_id    UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cohort_id    UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    is_private   BOOLEAN DEFAULT TRUE,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       VARCHAR(200) NOT NULL,
    content     TEXT NOT NULL,
    author_id   UUID REFERENCES users(id) ON DELETE CASCADE,
    cohort_id   UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    is_pinned   BOOLEAN DEFAULT FALSE,
    expires_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- NEWS
CREATE TABLE IF NOT EXISTS news (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title         VARCHAR(200) NOT NULL,
    content       TEXT NOT NULL,
    summary       TEXT,
    image_url     TEXT,
    external_link TEXT,
    author_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    cohort_id     UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    published_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- LINKS
CREATE TABLE IF NOT EXISTS links (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       VARCHAR(200) NOT NULL,
    url         TEXT NOT NULL,
    description TEXT,
    category    VARCHAR(100),
    author_id   UUID REFERENCES users(id) ON DELETE CASCADE,
    cohort_id   UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    is_important BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- IMPORTANT_EMAILS
CREATE TABLE IF NOT EXISTS important_emails (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject      VARCHAR(200) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    content      TEXT,
    sent_date    TIMESTAMPTZ,
    cohort_id    UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    added_by     UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(50) NOT NULL,
    title      VARCHAR(200) NOT NULL,
    content    TEXT,
    data       JSONB,
    is_read    BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_users_cohort_id          ON users(cohort_id);
CREATE INDEX IF NOT EXISTS idx_users_stream_id          ON users(stream_id);
CREATE INDEX IF NOT EXISTS idx_posts_cohort_id          ON posts(cohort_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id          ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at         ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id         ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_post_id        ON reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_activities_cohort_id     ON activities(cohort_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_cohort_id    ON suggestions(cohort_id);
CREATE INDEX IF NOT EXISTS idx_announcements_cohort_id  ON announcements(cohort_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id    ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_id_cohort          ON posts(id, cohort_id);
CREATE INDEX IF NOT EXISTS idx_activities_id_cohort     ON activities(id, cohort_id);
CREATE INDEX IF NOT EXISTS idx_post_media_postid        ON post_media(post_id);
CREATE INDEX IF NOT EXISTS idx_activity_media_actid     ON activity_media(activity_id);

-- UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated          ON users;
DROP TRIGGER IF EXISTS trg_posts_updated          ON posts;
DROP TRIGGER IF EXISTS trg_activities_updated     ON activities;
DROP TRIGGER IF EXISTS trg_suggestions_updated    ON suggestions;
DROP TRIGGER IF EXISTS trg_announcements_updated  ON announcements;
DROP TRIGGER IF EXISTS trg_news_updated           ON news;

CREATE TRIGGER trg_users_updated         BEFORE UPDATE ON users         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_posts_updated         BEFORE UPDATE ON posts         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_activities_updated    BEFORE UPDATE ON activities    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_suggestions_updated   BEFORE UPDATE ON suggestions   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_announcements_updated BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_news_updated          BEFORE UPDATE ON news          FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- Add uniqueness so ON CONFLICT (name) works
ALTER TABLE public.cohorts ADD CONSTRAINT cohorts_name_key UNIQUE (name);
ALTER TABLE public.streams ADD CONSTRAINT streams_name_key UNIQUE (name);
-- Recommended idempotency:
ALTER TABLE public.weeks   ADD CONSTRAINT weeks_cohort_number_key UNIQUE (cohort_id, number);
