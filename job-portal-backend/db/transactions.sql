DELIMITER //

-- Register a new user
CREATE PROCEDURE register_user_transaction(
    IN email VARCHAR(255),
    IN password VARCHAR(255),
    IN user_type ENUM('recruiter', 'applicant'),
    IN name VARCHAR(100),
    IN contact_number VARCHAR(15),
    IN bio_or_skills TEXT
)
BEGIN
    DECLARE user_id INT;

    START TRANSACTION;

    INSERT INTO Users (email, password, type)
    VALUES (email, password, user_type);

    SET user_id = LAST_INSERT_ID();

    IF user_type = 'recruiter' THEN
        INSERT INTO Recruiters (user_id, name, contact_number, bio)
        VALUES (user_id, name, contact_number, bio_or_skills);
    ELSE
        INSERT INTO JobApplicants (user_id, name, skills)
        VALUES (user_id, name, bio_or_skills);
    END IF;

    COMMIT;
END;
//

--  Post a new job
CREATE PROCEDURE post_job_transaction(
    IN recruiter_id INT,
    IN title VARCHAR(255),
    IN category VARCHAR(100),
    IN location VARCHAR(255),
    IN salary INT,
    IN job_type ENUM('full-time', 'part-time', 'internship', 'freelance'),
    IN skills TEXT
)
BEGIN
    DECLARE job_id INT;

    START TRANSACTION;

    INSERT INTO Jobs (recruiter_id, title, category, location, salary, job_type, date_of_posting)
    VALUES (recruiter_id, title, category, location, salary, job_type, NOW());

    SET job_id = LAST_INSERT_ID();

    INSERT INTO JobSkillsets (job_id, skill)
    SELECT job_id, skill
    FROM JSON_TABLE(skills, '$[*]' COLUMNS (skill VARCHAR(100) PATH '$')) AS parsed_skills;

    COMMIT;
END;
//

-- Apply for a job
CREATE PROCEDURE apply_job_transaction(
    IN applicant_id INT,
    IN job_id INT,
    IN sop TEXT
)
BEGIN
    START TRANSACTION;

    INSERT INTO Applications (user_id, job_id, status, date_of_application)
    VALUES (applicant_id, job_id, 'applied', NOW());

    UPDATE Jobs
    SET active_applications = active_applications + 1
    WHERE id = job_id;

    COMMIT;
END;
//

DELIMITER ;