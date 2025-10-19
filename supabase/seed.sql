-- Majlis Console Seed Data
-- Initial data for Accenture Academy Cohort 6

-- Insert cohorts
INSERT INTO cohorts (name, description, start_date, end_date) VALUES
('Cohort 6', 'Accenture Academy Cohort 6 - Data & AI and Cybersecurity streams', '2024-01-15', '2024-12-15'),
('Cohort 5', 'Accenture Academy Cohort 5 - Previous cohort for testing', '2023-01-15', '2023-12-15');

-- Insert streams
INSERT INTO streams (name, description) VALUES
('Data & AI stream', 'Focus on data science, machine learning, and artificial intelligence'),
('Cybersecurity stream', 'Focus on cybersecurity, ethical hacking, and security operations');

-- Insert weeks for Cohort 6 (assuming 12-week program)
INSERT INTO weeks (number, title, start_date, end_date, cohort_id) VALUES
(1, 'Introduction & Orientation', '2024-01-15', '2024-01-21', (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
(2, 'Fundamentals Week', '2024-01-22', '2024-01-28', (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
(3, 'Core Concepts', '2024-01-29', '2024-02-04', (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
(4, 'Practical Applications', '2024-02-05', '2024-02-11', (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
(5, 'Advanced Topics', '2024-02-12', '2024-02-18', (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
(6, 'Project Work', '2024-02-19', '2024-02-25', (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
(7, 'Mid-Program Review', '2024-02-26', '2024-03-03', (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
(8, 'Specialization Deep Dive', '2024-03-04', '2024-03-10', (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
(9, 'Industry Projects', '2024-03-11', '2024-03-17', (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
(10, 'Final Projects', '2024-03-18', '2024-03-24', (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
(11, 'Presentation Week', '2024-03-25', '2024-03-31', (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
(12, 'Graduation & Wrap-up', '2024-04-01', '2024-04-07', (SELECT id FROM cohorts WHERE name = 'Cohort 6'));

-- Insert sample activities
INSERT INTO activities (title, description, holder, week_id, stream_id, cohort_id, activity_date, location, activity_type) VALUES
('Welcome Session', 'Official welcome and program overview', 'Dr. Sarah Johnson', 
 (SELECT id FROM weeks WHERE number = 1 AND cohort_id = (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
 NULL, 
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 '2024-01-15 09:00:00+03', 'Main Auditorium', 'orientation'),

('Data Science Fundamentals', 'Introduction to data science concepts and tools', 'Prof. Ahmed Hassan',
 (SELECT id FROM weeks WHERE number = 2 AND cohort_id = (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
 (SELECT id FROM streams WHERE name = 'Data & AI stream'),
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 '2024-01-23 10:00:00+03', 'Lab A101', 'workshop'),

('Cybersecurity Basics', 'Network security fundamentals', 'Dr. Fatima Al-Rashid',
 (SELECT id FROM weeks WHERE number = 2 AND cohort_id = (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
 (SELECT id FROM streams WHERE name = 'Cybersecurity stream'),
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 '2024-01-24 10:00:00+03', 'Lab B203', 'workshop'),

('Team Building Activity', 'Collaborative problem-solving exercise', 'Team Lead Michael Chen',
 (SELECT id FROM weeks WHERE number = 1 AND cohort_id = (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
 NULL,
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 '2024-01-17 14:00:00+03', 'Outdoor Area', 'team-building'),

('Machine Learning Workshop', 'Hands-on ML project development', 'Dr. Layla Al-Mansouri',
 (SELECT id FROM weeks WHERE number = 5 AND cohort_id = (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
 (SELECT id FROM streams WHERE name = 'Data & AI stream'),
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 '2024-02-14 09:00:00+03', 'AI Lab', 'workshop'),

('Ethical Hacking Lab', 'Penetration testing simulation', 'Prof. Khalid Ibrahim',
 (SELECT id FROM weeks WHERE number = 5 AND cohort_id = (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
 (SELECT id FROM streams WHERE name = 'Cybersecurity stream'),
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 '2024-02-15 09:00:00+03', 'Security Lab', 'lab');

-- Insert sample announcements
INSERT INTO announcements (title, content, author_id, cohort_id, is_pinned, expires_at) VALUES
('Welcome to Cohort 6!', 'Welcome to Accenture Academy Cohort 6! We are excited to have you join our Data & AI and Cybersecurity streams. This portal will be your main hub for communication, activities, and resources throughout the program.', 
 (SELECT id FROM users WHERE email = 'admin@accentureacademy.com'),
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 TRUE,
 '2024-02-15 23:59:59+03'),

('Important: Program Guidelines', 'Please review the program guidelines and code of conduct available in the Important section. All participants are expected to adhere to these guidelines throughout the program.',
 (SELECT id FROM users WHERE email = 'admin@accentureacademy.com'),
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 TRUE,
 '2024-12-31 23:59:59+03'),

('Weekly Check-in Reminder', 'Don\'t forget to complete your weekly check-in forms every Friday. These help us track your progress and provide better support.',
 (SELECT id FROM users WHERE email = 'fellow1@accentureacademy.com'),
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 FALSE,
 '2024-01-26 23:59:59+03');

-- Insert sample news
INSERT INTO news (title, content, summary, author_id, cohort_id, published_at) VALUES
('Accenture Partners with Local Tech Companies', 'Accenture has announced new partnerships with leading local technology companies to provide internship opportunities for academy graduates. This initiative will create pathways for real-world experience and potential employment opportunities.', 
 'New internship opportunities available for graduates',
 (SELECT id FROM users WHERE email = 'admin@accentureacademy.com'),
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 '2024-01-20 10:00:00+03'),

('AI Ethics Workshop Series Announced', 'A special workshop series on AI ethics and responsible AI development will be held next month. This series is mandatory for Data & AI stream participants and recommended for all students.',
 'Upcoming AI ethics workshop series',
 (SELECT id FROM users WHERE email = 'fellow1@accentureacademy.com'),
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 '2024-01-18 14:30:00+03');

-- Insert sample links
INSERT INTO links (title, url, description, category, author_id, cohort_id, is_important) VALUES
('Program Handbook', 'https://resources.accentureacademy.com/cohort6/handbook.pdf', 'Complete program guide and reference materials', 'Documentation',
 (SELECT id FROM users WHERE email = 'admin@accentureacademy.com'),
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 TRUE),

('Slack Workspace', 'https://accentureacademy.slack.com', 'Join our community Slack workspace for real-time discussions', 'Communication',
 (SELECT id FROM users WHERE email = 'fellow1@accentureacademy.com'),
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 TRUE),

('GitHub Organization', 'https://github.com/accenture-academy-cohort6', 'All project repositories and code samples', 'Development',
 (SELECT id FROM users WHERE email = 'fellow2@accentureacademy.com'),
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 FALSE),

('Course Materials', 'https://learn.accentureacademy.com/cohort6', 'Online learning platform with all course content', 'Learning',
 (SELECT id FROM users WHERE email = 'admin@accentureacademy.com'),
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 TRUE);

-- Insert sample important emails
INSERT INTO important_emails (subject, sender_email, content, sent_date, cohort_id, added_by) VALUES
('Welcome to Your Learning Journey', 'admissions@accentureacademy.com', 'Welcome to Accenture Academy! Your learning journey begins now. Please find attached your welcome packet containing important information about the program, schedule, and resources.', 
 '2024-01-10 09:00:00+03',
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 (SELECT id FROM users WHERE email = 'admin@accentureacademy.com')),

('Week 1 Assignment Reminder', 'instructor@accentureacademy.com', 'This is a reminder about your Week 1 assignments due this Friday. Please ensure you complete all required readings and submit your reflection paper by 5:00 PM.', 
 '2024-01-22 14:00:00+03',
 (SELECT id FROM cohorts WHERE name = 'Cohort 6'),
 (SELECT id FROM users WHERE email = 'fellow1@accentureacademy.com'));

-- Note: Users will be created through Supabase Auth and then inserted into the users table
-- Sample user creation would look like:
-- INSERT INTO users (id, email, full_name, role, stream_id, cohort_id) VALUES
-- ('auth-user-id-1', 'student1@email.com', 'Ahmed Mohammed', 'member', 
--  (SELECT id FROM streams WHERE name = 'Data & AI stream'),
--  (SELECT id FROM cohorts WHERE name = 'Cohort 6')),
-- ('auth-user-id-2', 'student2@email.com', 'Fatima Al-Zahra', 'member',
--  (SELECT id FROM streams WHERE name = 'Cybersecurity stream'),
--  (SELECT id FROM cohorts WHERE name = 'Cohort 6'));