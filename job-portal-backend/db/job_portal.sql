CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    type ENUM('recruiter', 'applicant') NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= -1.0 AND rating <= 5.0)
);

CREATE TABLE Recruiters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(15),
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE JobApplicants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    skills TEXT,
    resume VARCHAR(255),
    profile VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    field VARCHAR(255) DEFAULT 'Not Specified',
    start_year YEAR NOT NULL CHECK (start_year >= 1930),
    end_year YEAR,
    FOREIGN KEY (applicant_id) REFERENCES JobApplicants(id) ON DELETE CASCADE,
    CHECK (end_year >= start_year)
);

CREATE TABLE Jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    max_applicants INT CHECK (max_applicants > 0),
    max_positions INT CHECK (max_positions > 0),
    active_applications INT DEFAULT 0 CHECK (active_applications >= 0),
    accepted_candidates INT DEFAULT 0 CHECK (accepted_candidates >= 0),
    date_of_posting DATETIME DEFAULT CURRENT_TIMESTAMP,
    deadline DATETIME,
    job_type ENUM('full-time', 'part-time', 'internship', 'freelance') NOT NULL,
    duration INT CHECK (duration >= 0),
    salary INT CHECK (salary >= 0),
    FOREIGN KEY (recruiter_id) REFERENCES Recruiters(id) ON DELETE CASCADE
);

CREATE TABLE JobSkillsets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    skill VARCHAR(100) NOT NULL,
    FOREIGN KEY (job_id) REFERENCES Jobs(id) ON DELETE CASCADE
);

CREATE TABLE Applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recruiter_id INT NOT NULL,
    job_id INT NOT NULL,
    status ENUM('applied', 'shortlisted', 'accepted', 'rejected', 'deleted', 'cancelled', 'finished') DEFAULT 'applied',
    date_of_application DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_of_joining DATETIME,
    FOREIGN KEY (user_id) REFERENCES JobApplicants(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recruiter_id) REFERENCES Recruiters(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES Jobs(id) ON DELETE CASCADE
);

CREATE TABLE Ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category ENUM('job', 'applicant', 'recruiter') NOT NULL,
    receiver_id INT NOT NULL,
    sender_id INT NOT NULL,
    rating DECIMAL(2,1) DEFAULT -1.0 CHECK (rating >= -1.0 AND rating <= 5.0),
    UNIQUE (category, receiver_id, sender_id),
    FOREIGN KEY (receiver_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
