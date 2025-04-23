DELIMITER //

-- Prevents a job from being over-applied
CREATE TRIGGER trg_check_max_applicants
BEFORE INSERT ON Applications
FOR EACH ROW
BEGIN
    DECLARE current_applicants INT;

    SELECT active_applications INTO current_applicants
    FROM Jobs
    WHERE id = NEW.job_id;

    IF current_applicants >= (SELECT max_applicants FROM Jobs WHERE id = NEW.job_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Maximum number of applicants reached for this job.';
    END IF;
END;
//

-- Increment active_applications when a new application is inserted
CREATE TRIGGER trg_increment_active_applications
AFTER INSERT ON Applications
FOR EACH ROW
BEGIN
    UPDATE Jobs
    SET active_applications = active_applications + 1
    WHERE id = NEW.job_id;
END;
//

-- Decrement active_applications when an application is rejected or cancelled
CREATE TRIGGER trg_decrement_active_applications
AFTER UPDATE ON Applications
FOR EACH ROW
BEGIN
    IF NEW.status IN ('cancelled', 'rejected') AND OLD.status = 'applied' THEN
        UPDATE Jobs
        SET active_applications = active_applications - 1
        WHERE id = NEW.job_id;
    END IF;
END;
//

-- Increment accepted_candidates when an application is accepted
CREATE TRIGGER trg_increment_accepted_candidates
AFTER UPDATE ON Applications
FOR EACH ROW
BEGIN
    IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
        UPDATE Jobs
        SET accepted_candidates = accepted_candidates + 1
        WHERE id = NEW.job_id;
    END IF;
END;
//

DELIMITER ;