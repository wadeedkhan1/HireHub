const { runQuery, callProcedure } = require("../db/query");

exports.applyForJob = async (userId, jobId) => {
  const [job] = await runQuery("SELECT recruiter_id FROM Jobs WHERE id = ?", [jobId]);
  if (!job) throw new Error(`Job ${jobId} not found`);
  
  const existing = await runQuery(
    "SELECT id FROM Applications WHERE user_id = ? AND job_id = ?",
    [userId, jobId]
  );
  if (existing.length > 0) {
    throw new Error(`You've already applied to job #${jobId}`);
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
    
    // Create a default JobApplicant entry
    await runQuery(
      "INSERT INTO JobApplicants (user_id, name, skills) VALUES (?, ?, ?)",
      [userId, defaultName, ""]
    );
  }

  // Insert the application
  const result = await runQuery(
    `
    INSERT INTO Applications (user_id, recruiter_id, job_id, status)
    VALUES (?, ?, ?, 'applied')
    `,
    [userId, job.recruiter_id, jobId]
  );

  const note = `✅ Application submitted for job #${jobId}`;
  await runQuery("INSERT INTO Notifications (user_id, message) VALUES (?, ?)", [userId, note]);

  return result;
};

exports.updateStatus = async (applicationId, newStatus) => {
  const result = await callProcedure("update_application_status", [
    applicationId,
    newStatus
  ]);

  const [appRow] = await runQuery(
    "SELECT user_id FROM Applications WHERE id = ?",
    [applicationId]
  );
  if (appRow) {
    const note = `📢 Your application #${applicationId} is now "${newStatus}"`;
    await runQuery("INSERT INTO Notifications (user_id, message) VALUES (?, ?)", [
      appRow.user_id,
      note
    ]);
  }

  return result;
};

exports.getApplicationsByUser = async (userId) => {
  return await runQuery(
    `
    SELECT a.id AS application_id, j.title, a.status, a.date_of_application
    FROM Applications a
    JOIN Jobs j ON j.id = a.job_id
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
