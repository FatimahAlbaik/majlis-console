-- Majlis Console Seed Data – Cohort 6

-- Cohorts
INSERT INTO cohorts (name, description, start_date, end_date) VALUES
('Cohort 6', 'Accenture Academy Cohort 6 - Data & AI and Cybersecurity streams', '2024-01-15', '2024-12-15')
ON CONFLICT (name) DO NOTHING;

INSERT INTO cohorts (name, description, start_date, end_date) VALUES
('Cohort 5', 'Accenture Academy Cohort 5 - Previous cohort for testing', '2023-01-15', '2023-12-15')
ON CONFLICT (name) DO NOTHING;

-- Streams
INSERT INTO streams (name, description) VALUES
('Data & AI stream', 'Focus on data science, machine learning, and artificial intelligence')
ON CONFLICT (name) DO NOTHING;

INSERT INTO streams (name, description) VALUES
('Cybersecurity stream', 'Focus on cybersecurity, ethical hacking, and security operations')
ON CONFLICT (name) DO NOTHING;

-- Weeks for Cohort 6
WITH c AS (
  SELECT id FROM cohorts WHERE name='Cohort 6'
), lists AS (
  SELECT
    ARRAY['Introduction & Orientation','Fundamentals Week','Core Concepts','Practical Applications',
          'Advanced Topics','Project Work','Mid-Program Review','Specialization Deep Dive',
          'Industry Projects','Final Projects','Presentation Week','Graduation & Wrap-up'] AS titles,
    ARRAY['2024-01-15','2024-01-22','2024-01-29','2024-02-05','2024-02-12','2024-02-19',
          '2024-02-26','2024-03-04','2024-03-11','2024-03-18','2024-03-25','2024-04-01'] AS starts,
    ARRAY['2024-01-21','2024-01-28','2024-02-04','2024-02-11','2024-02-18','2024-02-25',
          '2024-03-03','2024-03-10','2024-03-17','2024-03-24','2024-03-31','2024-04-07'] AS ends
)
INSERT INTO weeks (number, title, start_date, end_date, cohort_id)
SELECT i, lists.titles[i], lists.starts[i]::date, lists.ends[i]::date, c.id
FROM c, lists, generate_series(1,12) AS i
ON CONFLICT DO NOTHING;

-- Sample activities
INSERT INTO activities (title, description, holder, week_id, stream_id, cohort_id, activity_date, location, activity_type)
VALUES
('Welcome Session', 'Official welcome and program overview', 'Dr. Sarah Johnson',
 (SELECT id FROM weeks WHERE number=1 AND cohort_id=(SELECT id FROM cohorts WHERE name='Cohort 6')),
 NULL, (SELECT id FROM cohorts WHERE name='Cohort 6'),
 '2024-01-15 09:00:00+03', 'Main Auditorium', 'orientation'),

('Data Science Fundamentals', 'Introduction to data science concepts and tools', 'Prof. Ahmed Hassan',
 (SELECT id FROM weeks WHERE number=2 AND cohort_id=(SELECT id FROM cohorts WHERE name='Cohort 6')),
 (SELECT id FROM streams WHERE name='Data & AI stream'),
 (SELECT id FROM cohorts WHERE name='Cohort 6'),
 '2024-01-23 10:00:00+03', 'Lab A101', 'workshop'),

('Cybersecurity Basics', 'Network security fundamentals', 'Dr. Fatima Al-Rashid',
 (SELECT id FROM weeks WHERE number=2 AND cohort_id=(SELECT id FROM cohorts WHERE name='Cohort 6')),
 (SELECT id FROM streams WHERE name='Cybersecurity stream'),
 (SELECT id FROM cohorts WHERE name='Cohort 6'),
 '2024-01-24 10:00:00+03', 'Lab B203', 'workshop')
ON CONFLICT DO NOTHING;

-- Pick any admin id from users (safer than hard-coding an email)
WITH admin_user AS (
  SELECT id FROM users WHERE role='admin' ORDER BY created_at LIMIT 1
)
-- Sample announcement
INSERT INTO announcements (title, content, author_id, cohort_id, is_pinned, expires_at)
SELECT
 'Welcome to Cohort 6!',
 'Welcome to Accenture Academy Cohort 6! This portal is your main hub.',
 admin_user.id,
 (SELECT id FROM cohorts WHERE name='Cohort 6'),
 TRUE, '2024-02-15 23:59:59+03'
FROM admin_user
ON CONFLICT DO NOTHING;

-- Sample news
WITH admin_user AS (
  SELECT id FROM users WHERE role='admin' ORDER BY created_at LIMIT 1
)
INSERT INTO news (title, content, summary, author_id, cohort_id, published_at)
SELECT
 'Accenture Partners with Local Tech Companies',
 'Accenture has announced new partnerships …',
 'New internship opportunities available for graduates',
 admin_user.id,
 (SELECT id FROM cohorts WHERE name='Cohort 6'),
 '2024-01-20 10:00:00+03'
FROM admin_user
ON CONFLICT DO NOTHING;

-- Sample link
WITH admin_user AS (
  SELECT id FROM users WHERE role='admin' ORDER BY created_at LIMIT 1
)
INSERT INTO links (title, url, description, category, author_id, cohort_id, is_important)
SELECT
 'Program Handbook',
 'https://resources.accentureacademy.com/cohort6/handbook.pdf',
 'Complete program guide',
 'Documentation',
 admin_user.id,
 (SELECT id FROM cohorts WHERE name='Cohort 6'),
 TRUE
FROM admin_user
ON CONFLICT DO NOTHING;

-- Sample important email
WITH admin_user AS (
  SELECT id FROM users WHERE role='admin' ORDER BY created_at LIMIT 1
)
INSERT INTO important_emails (subject, sender_email, content, sent_date, cohort_id, added_by)
SELECT
 'Welcome to Your Learning Journey',
 'admissions@accentureacademy.com',
 'Welcome to Accenture Academy! …',
 '2024-01-10 09:00:00+03',
 (SELECT id FROM cohorts WHERE name='Cohort 6'),
 admin_user.id
FROM admin_user
ON CONFLICT DO NOTHING;
