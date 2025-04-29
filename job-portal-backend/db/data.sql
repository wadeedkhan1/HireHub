-- 1. Insert demo users into the Users table
INSERT INTO Users (email, password, type, rating) VALUES
('demo.applicant@example.com', 'demo123', 'applicant', 4.5),
('demo.recruiter@example.com', 'demo123', 'recruiter', 4.5);

SET @demo_applicant_id = LAST_INSERT_ID();
SET @demo_recruiter_id = @demo_applicant_id + 1;

INSERT INTO JobApplicants (user_id, name, skills, resume, profile) VALUES
(@demo_applicant_id, 'Demo Applicant', 'JavaScript, React, Node.js, SQL', 'demo_resume.pdf', 'Demo Applicant Profile');

INSERT INTO Recruiters (user_id, name, contact_number, bio) VALUES
(@demo_recruiter_id, 'Demo Recruiter', '03000000000', 'This is a demo recruiter account for testing purposes.');

INSERT INTO Education (applicant_id, institution_name, start_year, end_year) VALUES
(LAST_INSERT_ID() - 1, 'Demo University', 2018, 2022);

-- Populate Users
INSERT INTO Users (email, password, type, rating) VALUES
('recruiter1@example.com', 'pass123', 'recruiter', 4.5),
('recruiter2@example.com', 'pass123', 'recruiter', 3.8),
('recruiter3@example.com', 'pass123', 'recruiter', 4.0),
('recruiter4@example.com', 'pass123', 'recruiter', 4.2),
('recruiter5@example.com', 'pass123', 'recruiter', 3.9),
('recruiter6@example.com', 'pass123', 'recruiter', 4.1),
('recruiter7@example.com', 'pass123', 'recruiter', 4.3),
('recruiter8@example.com', 'pass123', 'recruiter', 4.6),
('recruiter9@example.com', 'pass123', 'recruiter', 3.7),
('recruiter10@example.com', 'pass123', 'recruiter', 4.4),
('applicant1@example.com', 'pass123', 'applicant', 4.5),
('applicant2@example.com', 'pass123', 'applicant', 3.8),
('applicant3@example.com', 'pass123', 'applicant', 4.0),
('applicant4@example.com', 'pass123', 'applicant', 4.2),
('applicant5@example.com', 'pass123', 'applicant', 3.9),
('applicant6@example.com', 'pass123', 'applicant', 4.1),
('applicant7@example.com', 'pass123', 'applicant', 4.3),
('applicant8@example.com', 'pass123', 'applicant', 4.6),
('applicant9@example.com', 'pass123', 'applicant', 3.7),
('applicant10@example.com', 'pass123', 'applicant', 4.4),
('applicant11@example.com', 'pass123', 'applicant', 4.5),
('applicant12@example.com', 'pass123', 'applicant', 3.8),
('applicant13@example.com', 'pass123', 'applicant', 4.0),
('applicant14@example.com', 'pass123', 'applicant', 4.2),
('applicant15@example.com', 'pass123', 'applicant', 3.9),
('applicant16@example.com', 'pass123', 'applicant', 4.1),
('applicant17@example.com', 'pass123', 'applicant', 4.3),
('applicant18@example.com', 'pass123', 'applicant', 4.6),
('applicant19@example.com', 'pass123', 'applicant', 3.7),
('applicant20@example.com', 'pass123', 'applicant', 4.4);

-- Populate Recruiters
INSERT INTO Recruiters (user_id, name, contact_number, bio) VALUES
(1, 'Ali Raza', '03001234567', 'Leading tech company specializing in software development.'),
(2, 'Hina Khalid', '03007654321', 'Finance sector experts with a focus on investment banking.'),
(3, 'Usman Tariq', '03009876543', 'Innovative startup in the health sector.'),
(4, 'Sana Ahmed', '03003456789', 'Education-focused organization looking for passionate individuals.'),
(5, 'Fahad Malik', '03004567890', 'E-commerce platform seeking talented developers.'),
(6, 'Amna Sheikh', '03005678901', 'Digital marketing agency with a creative edge.'),
(7, 'Zainab Qureshi', '03006789012', 'Manufacturing company with a global presence.'),
(8, 'Bilal Aslam', '03007890123', 'Telecommunications firm looking for engineers.'),
(9, 'Nida Farooq', '03008901234', 'Consulting firm specializing in business solutions.'),
(10, 'Hamza Yousaf', '03009012345', 'Non-profit organization focused on community development.');

-- Populate JobApplicants
INSERT INTO JobApplicants (user_id, name, skills, resume, profile) VALUES
(11, 'Ahmed Ali', 'Java, Python', 'resume1.pdf', 'Profile link 1'),
(12, 'Fatima Noor', 'JavaScript, React', 'resume2.pdf', 'Profile link 2'),
(13, 'Saad Khan', 'C++, C#', 'resume3.pdf', 'Profile link 3'),
(14, 'Rabia Shah', 'PHP, Laravel', 'resume4.pdf', 'Profile link 4'),
(15, 'Usama Bin Qasim', 'HTML, CSS', 'resume5.pdf', 'Profile link 5'),
(16, 'Zara Iqbal', 'Node.js, Express', 'resume6.pdf', 'Profile link 6'),
(17, 'Ahsan Jamil', 'Ruby, Rails', 'resume7.pdf', 'Profile link 7'),
(18, 'Mariam Hanif', 'Swift, iOS', 'resume8.pdf', 'Profile link 8'),
(19, 'Haris Imran', 'Android, Kotlin', 'resume9.pdf', 'Profile link 9'),
(20, 'Sadia Naveed', 'Django, Python', 'resume10.pdf', 'Profile link 10'),
(21, 'Tariq Hussain', 'Go, Microservices', 'resume11.pdf', 'Profile link 11'),
(22, 'Amina Zafar', 'Scala, Akka', 'resume12.pdf', 'Profile link 12'),
(23, 'Moiz Arshad', 'Rust, WebAssembly', 'resume13.pdf', 'Profile link 13'),
(24, 'Yusra Rehman', 'C, Embedded Systems', 'resume14.pdf', 'Profile link 14'),
(25, 'Asif Mehmood', 'SQL, Database Management', 'resume15.pdf', 'Profile link 15'),
(26, 'Sumbul Ayaz', 'Machine Learning, AI', 'resume16.pdf', 'Profile link 16'),
(27, 'Imran Nazir', 'Cybersecurity, Ethical Hacking', 'resume17.pdf', 'Profile link 17'),
(28, 'Nashit Nadeem', 'Blockchain, Smart Contracts', 'resume18.pdf', 'Profile link 18'),
(29, 'Mahnoor Saleem', 'Data Science, Analytics', 'resume19.pdf', 'Profile link 19'),
(30, 'Salman Awan', 'DevOps, CI/CD', 'resume20.pdf', 'Profile link 20');

-- Populate Education
INSERT INTO Education (applicant_id, institution_name, start_year, end_year) VALUES
(1, 'FAST-NUCES', 2015, 2019),
(2, 'LUMS', 2016, 2020),
(3, 'NUST', 2017, 2021),
(4, 'UET Lahore', 2018, 2022),
(5, 'GIKI', 2014, 2018),
(6, 'IBA Karachi', 2015, 2019),
(7, 'PIEAS', 2016, 2020),
(8, 'FAST-NUCES', 2017, 2021),
(9, 'NUST', 2018, 2022),
(10, 'LUMS', 2019, 2023),
(11, 'GIKI', 2015, 2019),
(12, 'IBA Karachi', 2016, 2020),
(13, 'PIEAS', 2017, 2021),
(14, 'UET Lahore', 2018, 2022),
(15, 'NUST', 2019, 2023),
(16, 'FAST-NUCES', 2015, 2019),
(17, 'LUMS', 2016, 2020),
(18, 'GIKI', 2017, 2021),
(19, 'IBA Karachi', 2018, 2022),
(20, 'PIEAS', 2019, 2023);


-- Populate Jobs
INSERT INTO Jobs (recruiter_id, title, category, location, max_applicants, max_positions, job_type, duration, salary) VALUES
(1, 'Software Engineer', 'IT', 'Karachi', 20, 3, 'full-time', 12, 85000),
(2, 'Data Analyst', 'Finance', 'Lahore', 15, 2, 'full-time', 12, 70000),
(3, 'Web Developer', 'IT', 'Islamabad', 25, 3, 'part-time', 6, 50000),
(4, 'Project Manager', 'Management', 'Karachi', 10, 1, 'full-time', 12, 100000),
(5, 'Digital Marketer', 'Marketing', 'Lahore', 10, 2, 'full-time', 12, 60000),
(6, 'Graphic Designer', 'Design', 'Karachi', 8, 1, 'part-time', 6, 40000),
(7, 'Business Analyst', 'Consulting', 'Islamabad', 12, 1, 'full-time', 12, 85000),
(8, 'Network Engineer', 'IT', 'Karachi', 18, 3, 'full-time', 12, 75000),
(9, 'Content Writer', 'Media', 'Lahore', 30, 5, 'part-time', 6, 30000),
(10, 'Sales Executive', 'Sales', 'Karachi', 50, 10, 'full-time', 12, 45000),
(1, 'Mobile App Developer', 'IT', 'Karachi', 15, 2, 'full-time', 12, 90000),
(2, 'Data Scientist', 'IT', 'Islamabad', 10, 1, 'full-time', 12, 110000),
(3, 'UI/UX Designer', 'Design', 'Lahore', 8, 2, 'part-time', 6, 50000),
(4, 'DevOps Engineer', 'IT', 'Karachi', 10, 1, 'full-time', 12, 95000),
(5, 'Cybersecurity Analyst', 'IT', 'Islamabad', 7, 1, 'full-time', 12, 100000),
(6, 'Blockchain Developer', 'IT', 'Lahore', 5, 1, 'full-time', 12, 105000),
(7, 'Cloud Engineer', 'IT', 'Karachi', 10, 1, 'full-time', 12, 95000),
(8, 'Technical Writer', 'Media', 'Islamabad', 20, 3, 'part-time', 6, 40000),
(9, 'QA Engineer', 'IT', 'Lahore', 12, 2, 'full-time', 12, 60000),
(10, 'AI Researcher', 'R&D', 'Karachi', 5, 1, 'full-time', 12, 120000),
(1, 'Full Stack Developer', 'IT', 'Islamabad', 20, 2, 'full-time', 12, 90000),
(2, 'Backend Developer', 'IT', 'Lahore', 15, 1, 'full-time', 12, 80000),
(3, 'Frontend Developer', 'IT', 'Karachi', 15, 1, 'part-time', 6, 55000),
(4, 'HR Manager', 'Management', 'Lahore', 6, 1, 'full-time', 12, 85000),
(5, 'Recruitment Officer', 'HR', 'Islamabad', 5, 1, 'full-time', 12, 70000),
(6, 'Marketing Strategist', 'Marketing', 'Karachi', 8, 2, 'full-time', 12, 75000),
(7, 'Operations Manager', 'Management', 'Lahore', 4, 1, 'full-time', 12, 95000),
(8, 'Systems Analyst', 'IT', 'Islamabad', 10, 1, 'full-time', 12, 80000),
(9, 'Product Manager', 'Product', 'Karachi', 5, 1, 'full-time', 12, 100000),
(10, 'Technical Support Engineer', 'IT', 'Lahore', 10, 2, 'full-time', 12, 55000);


-- Populate JobSkillsets
INSERT INTO JobSkillsets (job_id, skill) VALUES
(1, 'Java'),
(1, 'Spring'),
(2, 'Excel'),
(2, 'SQL'),
(3, 'HTML'),
(3, 'CSS'),
(4, 'Agile'),
(4, 'Scrum'),
(5, 'SEO'),
(5, 'Content Marketing'),
(6, 'Photoshop'),
(6, 'Illustrator'),
(7, 'Business Analysis'),
(7, 'Data Visualization'),
(8, 'Networking'),
(8, 'Security'),
(9, 'Writing'),
(9, 'Editing'),
(10, 'Sales Strategies'),
(10, 'Customer Relationship Management'),
(11, 'Recruitment'),
(11, 'Employee Relations'),
(12, 'Google Analytics'),
(12, 'Keyword Research'),
(13, 'React Native'),
(13, 'Flutter'),
(14, 'Machine Learning'),
(14, 'Statistical Analysis'),
(15, 'User Research'),
(15, 'Wireframing'),
(16, 'CI/CD'),
(16, 'Containerization'),
(17, 'Penetration Testing'),
(17, 'Risk Assessment'),
(18, 'Smart Contracts'),
(18, 'Cryptography'),
(19, 'AWS'),
(19, 'Azure'),
(20, 'Technical Documentation'),
(20, 'User Manuals');

-- Populate Applications
INSERT INTO Applications (user_id, recruiter_id, job_id, status) VALUES
(11, 1, 1, 'applied'),
(12, 2, 2, 'shortlisted'),
(13, 3, 3, 'accepted'),
(14, 4, 4, 'rejected'),
(15, 5, 5, 'applied'),
(16, 6, 6, 'cancelled'),
(17, 7, 7, 'applied'),
(18, 8, 8, 'shortlisted'),
(19, 9, 9, 'accepted'),
(20, 1, 10, 'rejected'),
(21, 1, 11, 'applied'),
(22, 2, 12, 'shortlisted'),
(23, 3, 13, 'accepted'),
(24, 4, 14, 'rejected'),
(25, 5, 15, 'applied'),
(26, 6, 16, 'cancelled'),
(27, 7, 17, 'applied'),
(28, 8, 18, 'shortlisted'),
(29, 9, 19, 'accepted'),
(30, 2, 20, 'rejected');

-- Populate Ratings
INSERT INTO Ratings (category, receiver_id, sender_id, rating) VALUES
('job', 1, 11, 4.5),
('job', 2, 12, 4.0),
('job', 3, 13, 4.2),
('job', 4, 14, 3.8),
('job', 5, 15, 4.1),
('applicant', 11, 1, 4.0),
('applicant', 12, 2, 3.5),
('applicant', 13, 3, 4.3),
('applicant', 14, 4, 4.0),
('applicant', 15, 5, 4.2),
('recruiter', 1, 11, 4.5),
('recruiter', 2, 12, 4.0),
('recruiter', 3, 13, 4.2),
('recruiter', 4, 14, 3.8),
('recruiter', 5, 15, 4.1);

-- Populate Notifications
INSERT INTO Notifications (user_id, message, is_read) VALUES
(1, 'You have a new application for your job posting.', FALSE),
(2, 'Your job has been shortlisted.', TRUE),
(3, 'You have been accepted for the job.', FALSE),
(4, 'Your application has been rejected.', TRUE),
(5, 'New job postings available.', FALSE),
(6, 'Your profile has been viewed.', TRUE),
(7, 'You have a new message from an applicant.', FALSE),
(8, 'Your job posting has been updated.', TRUE),
(9, 'You have a new application for your job posting.', FALSE),
(10, 'Your job has been shortlisted.', TRUE),
(11, 'You have a new application for your job posting.', FALSE),
(12, 'Your job has been updated.', TRUE),
(13, 'You have a new message from a recruiter.', FALSE),
(14, 'Your application has been rejected.', TRUE),
(15, 'New job postings available.', FALSE),
(16, 'Your profile has been viewed.', TRUE),
(17, 'You have a new message from a recruiter.', FALSE),
(18, 'Your job posting has been updated.', TRUE),
(19, 'You have a new application for your job posting.', FALSE),
(20, 'Your job has been shortlisted.', TRUE),
(21, 'You have a new application for your job posting.', FALSE),
(22, 'Your job has been updated.', TRUE),
(23, 'You have a new message from a recruiter.', FALSE),
(24, 'Your application has been rejected.', TRUE),
(25, 'New job postings available.', FALSE),
(26, 'Your profile has been viewed.', TRUE),
(27, 'You have a new message from a recruiter.', FALSE),
(28, 'Your job posting has been updated.', TRUE),
(29, 'You have a new application for your job posting.', FALSE),
(30, 'Your job has been shortlisted.', TRUE);