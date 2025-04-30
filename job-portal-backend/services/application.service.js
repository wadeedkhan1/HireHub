const { runQuery, callProcedure } = require("../db/query");

exports.applyForJob = async (userId, jobId, coverLetter = null) => {
  try {
    // Validate inputs
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (!jobId) {
      throw new Error('Job ID is required');
    }
    
    // Convert jobId to a number if it's a string
    const jobIdNum = typeof jobId === 'string' ? parseInt(jobId, 10) : jobId;
    
    if (isNaN(jobIdNum)) {
      throw new Error(`Invalid job ID format: ${jobId}`);
    }
    
    console.log(`Applying for job: User=${userId}, Job=${jobIdNum}, Has cover letter=${!!coverLetter}`);
    
    // Check if job exists - using the numeric job ID
    const jobs = await runQuery("SELECT recruiter_id, title, max_applicants FROM Jobs WHERE id = ?", [jobIdNum]);
    console.log('Job query result:', jobs);
    
    if (!jobs || jobs.length === 0) {
      throw new Error(`Job ${jobIdNum} not found`);
    }
    
    const job = jobs[0];
    
    // Check the current number of applications for this job
    const [applicationCountResult] = await runQuery(
      "SELECT COUNT(*) as count FROM Applications WHERE job_id = ?",
      [jobIdNum]
    );
    
    const currentApplicationCount = applicationCountResult.count;
    
    // Check if the maximum number of applicants has been reached
    if (currentApplicationCount >= job.max_applicants) {
      throw new Error(`Maximum number of applicants reached for this job (${job.max_applicants})`);
    }
    
    // Check if already applied
    const existing = await runQuery(
      "SELECT id FROM Applications WHERE user_id = ? AND job_id = ?",
      [userId, jobIdNum]
    );
    
    if (existing.length > 0) {
      throw new Error(`You've already applied to this job`);
    }
    
    // Check if the user exists in JobApplicants
    const applicantRows = await runQuery(
      "SELECT user_id FROM JobApplicants WHERE user_id = ?",
      [userId]
    );
    
    // If the user doesn't exist in JobApplicants, create a default entry
    if (applicantRows.length === 0) {
      // Get user info from Users table
      const userRows = await runQuery(
        "SELECT email FROM Users WHERE id = ?",
        [userId]
      );
      
      if (userRows.length === 0) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      const email = userRows[0].email;
      const defaultName = email.split('@')[0];
      
      console.log(`Creating default applicant profile for user ${userId}`);
      
      // Create a default JobApplicant entry
      await runQuery(
        "INSERT INTO JobApplicants (user_id, name, skills) VALUES (?, ?, ?)",
        [userId, defaultName, ""]
      );
    }

    // Insert the application with cover letter if provided
    console.log(`Inserting application record: user=${userId}, recruiter=${job.recruiter_id}, job=${jobIdNum}`);
    
    // Use a single query without the cover_letter field since it doesn't exist in the database
    let result;
    try {
      // Don't include cover_letter in the query as this column doesn't exist in the schema
      result = await runQuery(
        `
        INSERT INTO Applications (user_id, recruiter_id, job_id, status)
        VALUES (?, ?, ?, 'applied')
        `,
        [userId, job.recruiter_id, jobIdNum]
      );
      
      // If a cover letter was provided, we could log it or handle it separately in the future
      if (coverLetter) {
        console.log(`Cover letter provided but not stored in database: ${coverLetter.substring(0, 50)}...`);
      }
      
      // Update the active_applications count in the Jobs table
      await runQuery(
        "UPDATE Jobs SET active_applications = active_applications + 1 WHERE id = ?",
        [jobIdNum]
      );
    } catch (dbError) {
      console.error('Database error during application insertion:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    try {
      const note = `✅ Application submitted for ${job.title}`;
      await runQuery("INSERT INTO Notifications (user_id, message) VALUES (?, ?)", [userId, note]);
    } catch (notificationError) {
      console.warn('Failed to create notification, but application was submitted:', notificationError);
      // Don't fail the whole process for a notification error
    }

    return result;
  } catch (error) {
    console.error("Application service error:", error);
    throw error;
  }
};

exports.updateStatus = async (applicationId, newStatus) => {
  // First get the current status and job_id
  const [currentApp] = await runQuery(
    "SELECT status, job_id FROM Applications WHERE id = ?",
    [applicationId]
  );
  
  if (!currentApp) {
    throw new Error("Application not found");
  }
  
  const oldStatus = currentApp.status;
  const jobId = currentApp.job_id;
  
  // Update the application status
  await runQuery(
    "UPDATE Applications SET status = ? WHERE id = ?",
    [newStatus, applicationId]
  );

  // Update accepted_candidates count if status changes to or from 'accepted'
  if (oldStatus !== 'accepted' && newStatus === 'accepted') {
    // Increment accepted_candidates when status changes TO accepted
    await runQuery(
      "UPDATE Jobs SET accepted_candidates = accepted_candidates + 1 WHERE id = ?",
      [jobId]
    );
  } else if (oldStatus === 'accepted' && newStatus !== 'accepted') {
    // Decrement accepted_candidates when status changes FROM accepted
    await runQuery(
      "UPDATE Jobs SET accepted_candidates = GREATEST(accepted_candidates - 1, 0) WHERE id = ?",
      [jobId]
    );
  }

  // Get application details including job title
  const [appRow] = await runQuery(
    `SELECT a.user_id, j.title AS job_title
     FROM Applications a
     JOIN Jobs j ON a.job_id = j.id
     WHERE a.id = ?`,
    [applicationId]
  );
  
  if (appRow) {
    const note = `📢 Your application for "${appRow.job_title}" is now "${newStatus}"`;
    await runQuery("INSERT INTO Notifications (user_id, message) VALUES (?, ?)", [
      appRow.user_id,
      note
    ]);
  }

  return { applicationId, newStatus };
};

exports.getApplicationsByUser = async (userId) => {
  return await runQuery(
    `
    SELECT 
      a.id AS application_id, 
      j.title AS job_title, 
      r.name AS company_name,
      j.location,
      j.deadline,
      a.status, 
      a.date_of_application
    FROM Applications a
    JOIN Jobs j ON j.id = a.job_id
    JOIN Recruiters r ON j.recruiter_id = r.id
    WHERE a.user_id = ?
    ORDER BY a.date_of_application DESC
    `,
    [userId]
  );
};

exports.getApplicationsByRecruiter = async (recruiterId) => {
  return await runQuery(
    `
    SELECT a.id AS application_id, ja.name AS applicant_name, j.title AS job_title, a.status, a.date_of_application
    FROM Applications a
    JOIN JobApplicants ja ON a.user_id = ja.user_id
    JOIN Jobs j ON a.job_id = j.id
    WHERE a.recruiter_id = ?
    ORDER BY a.date_of_application DESC
    `,
    [recruiterId]
  );
};

exports.getApplicationDetails = async (applicationId) => {
  try {
    console.log(`Getting details for application ${applicationId}`);
    
    // First get the basic application info
    const [application] = await runQuery(
      `
      SELECT 
        a.id AS application_id,
        a.user_id,
        a.job_id,
        a.status,
        a.date_of_application,
        ja.name,
        j.title AS job_title,
        j.location AS job_location
      FROM Applications a
      JOIN JobApplicants ja ON a.user_id = ja.user_id
      JOIN Jobs j ON a.job_id = j.id
      WHERE a.id = ?
      `,
      [applicationId]
    );

    if (!application) {
      console.error(`Application ${applicationId} not found`);
      throw new Error("Application not found");
    }

    // Get additional applicant details
    const [applicantDetails] = await runQuery(
      `
      SELECT 
        ja.skills,
        ja.resume,
        ja.profile,
        u.email
      FROM JobApplicants ja
      JOIN Users u ON ja.user_id = u.id
      WHERE ja.user_id = ?
      `,
      [application.user_id]
    );

    if (applicantDetails) {
      // Merge applicant details with application
      Object.assign(application, applicantDetails);
      
      // Parse skills if they exist
      if (application.skills) {
        try {
          // If skills are stored as JSON string, parse them
          if (application.skills.startsWith('[')) {
            application.skills = JSON.parse(application.skills);
          } 
          // If skills are stored as comma-separated string, split them
          else {
            application.skills = application.skills.split(',').map(skill => skill.trim()).filter(Boolean);
          }
        } catch (e) {
          console.warn('Failed to parse skills:', e);
          application.skills = [application.skills]; // Fallback to treating it as a single skill
        }
      } else {
        application.skills = [];
      }
    }

    // Get education history if it exists
    try {
      const education = await runQuery(
        `
        SELECT 
          e.id,
          e.institution_name AS institution,
          e.field,
          e.start_year,
          e.end_year,
          CONCAT(e.start_year, ' - ', IFNULL(e.end_year, 'Present')) AS duration
        FROM Education e
        JOIN JobApplicants ja ON e.applicant_id = ja.id
        WHERE ja.user_id = ?
        ORDER BY e.start_year DESC
        `,
        [application.user_id]
      );
      
      if (education && education.length > 0) {
        // Add education data without overriding the field value
        application.education = education.map(edu => ({
          ...edu
        }));
      }
    } catch (eduError) {
      console.warn('Failed to fetch education data:', eduError);
      console.error(eduError);
    }

    console.log(`Successfully retrieved details for application ${applicationId}`);
    return application;
  } catch (error) {
    console.error(`Error getting application details for ID ${applicationId}:`, error.message);
    if (error.sql) {
      console.error("SQL query:", error.sql);
    }
    throw error;
  }
};

exports.getApplicationsByJob = async (jobId) => {
  try {
    console.log(`Getting applications for job ${jobId} - starting database query`);
    
    // First check if the job exists
    const jobs = await runQuery("SELECT id FROM Jobs WHERE id = ?", [jobId]);
    if (!jobs || jobs.length === 0) {
      console.error(`Job with ID ${jobId} not found`);
      throw new Error(`Job with ID ${jobId} not found`);
    }
    
    // Use a simplified query with only columns we know exist
    const result = await runQuery(
      `
      SELECT 
        a.id AS application_id, 
        a.user_id,
        a.status, 
        a.date_of_application,
        ja.name
      FROM Applications a
      JOIN JobApplicants ja ON a.user_id = ja.user_id
      WHERE a.job_id = ?
      ORDER BY a.date_of_application DESC
      `,
      [jobId]
    );
    
    console.log(`Successfully retrieved ${result.length} applications for job ${jobId}`);
    return result;
  } catch (error) {
    console.error(`Error getting applications for job ${jobId}:`, error.message);
    if (error.sql) {
      console.error("SQL query:", error.sql);
    }
    throw error;
  }
};
