DELIMITER //

-- Get user dashboard
CREATE PROCEDURE get_user_dashboard(
    IN uid INT
)
BEGIN
    SELECT a.id AS application_id, j.title AS job_title, a.status, a.date_of_application
    FROM Applications a
    JOIN Jobs j ON a.job_id = j.id
    WHERE a.user_id = uid;

    SELECT j.id AS job_id, j.title, j.category, j.location, j.salary, j.date_of_posting
    FROM Jobs j
    ORDER BY j.date_of_posting DESC
    LIMIT 10;

    SELECT n.message, n.is_read, n.created_at
    FROM Notifications n
    WHERE n.user_id = uid
    ORDER BY n.created_at DESC;
END;
//

-- Get recruiter dashboard
CREATE PROCEDURE get_recruiter_dashboard(
    IN rid INT
)
BEGIN
    SELECT j.id AS job_id, j.title, COUNT(a.id) AS total_applicants
    FROM Jobs j
    LEFT JOIN Applications a ON j.id = a.job_id
    WHERE j.recruiter_id = rid
    GROUP BY j.id;

    SELECT 
        a.id AS application_id, 
        ja.name AS applicant_name, 
        j.title AS job_title,
        a.status, 
        a.date_of_application
    FROM Applications a
    JOIN JobApplicants ja ON a.user_id = ja.user_id
    JOIN Jobs j ON a.job_id = j.id
    WHERE j.recruiter_id = rid
    ORDER BY a.date_of_application DESC
    LIMIT 10;
END;
//

-- Update application status
CREATE PROCEDURE update_application_status(
    IN app_id INT,
    IN new_status ENUM('applied', 'shortlisted', 'accepted', 'rejected', 'cancelled', 'finished')
)
BEGIN
    DECLARE old_status ENUM('applied', 'shortlisted', 'accepted', 'rejected', 'cancelled', 'finished');

    SELECT status INTO old_status
    FROM Applications
    WHERE id = app_id;

    UPDATE Applications
    SET status = new_status
    WHERE id = app_id;

    IF new_status = 'accepted' AND old_status != 'accepted' THEN
        UPDATE Jobs
        SET accepted_candidates = accepted_candidates + 1
        WHERE id = (SELECT job_id FROM Applications WHERE id = app_id);
    END IF;

    IF new_status IN ('cancelled', 'rejected') AND old_status = 'applied' THEN
        UPDATE Jobs
        SET active_applications = active_applications - 1
        WHERE id = (SELECT job_id FROM Applications WHERE id = app_id);
    END IF;
END;
//

DELIMITER ;