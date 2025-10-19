-- Majlis Console Database Schema
-- Accenture Academy Cohort 6 Portal

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cohorts table
CREATE TABLE cohorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streams table
CREATE TABLE streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weeks table for activity scheduling
CREATE TABLE weeks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    start_date DATE,
    end_date DATE,
    cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'fellow', 'member')),
    stream_id UUID REFERENCES streams(id),
    cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table for social feed
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stream_id UUID REFERENCES streams(id),
    cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    week_id UUID REFERENCES weeks(id),
    visibility VARCHAR(20) DEFAULT 'org' CHECK (visibility IN ('org', 'stream')),
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post media table
CREATE TABLE post_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video', 'pdf')),
    filename VARCHAR(255),
    size_bytes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reactions table
CREATE TABLE reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(10) NOT NULL CHECK (reaction_type IN ('👍', '👏', '❤️')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id, reaction_type)
);

-- Activities table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    holder VARCHAR(200),
    week_id UUID REFERENCES weeks(id),
    stream_id UUID REFERENCES streams(id),
    cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    activity_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(200),
    activity_type VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity media table
CREATE TABLE activity_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video', 'pdf')),
    filename VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suggestions table
CREATE TABLE suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in-review', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback table
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Announcements table
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    is_pinned BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News table
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    image_url TEXT,
    external_link TEXT,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Links table for important links
CREATE TABLE links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category VARCHAR(100),
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    is_important BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Important emails table
CREATE TABLE important_emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject VARCHAR(200) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    content TEXT,
    sent_date TIMESTAMP WITH TIME ZONE,
    cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    added_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_cohort_id ON users(cohort_id);
CREATE INDEX idx_users_stream_id ON users(stream_id);
CREATE INDEX idx_posts_cohort_id ON posts(cohort_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_reactions_post_id ON reactions(post_id);
CREATE INDEX idx_activities_cohort_id ON activities(cohort_id);
CREATE INDEX idx_suggestions_cohort_id ON suggestions(cohort_id);
CREATE INDEX idx_announcements_cohort_id ON announcements(cohort_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suggestions_updated_at BEFORE UPDATE ON suggestions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();