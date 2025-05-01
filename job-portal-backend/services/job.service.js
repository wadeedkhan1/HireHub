const { callProcedure, runQuery } = require('../db/query');

// Filtered search: supports salary range, job type, location, category
exports.searchJobs = async (filters) => {
  let query = 'SELECT * FROM Jobs WHERE 1=1';
  const params = [];

  if (filters.salaryMin !== undefined) {
    query += ' AND salary >= ?';
    params.push(filters.salaryMin);
  }

  if (filters.salaryMax !== undefined) {
    query += ' AND salary <= ?';
    params.push(filters.salaryMax);
  }

  if (filters.job_type) {
    query += ' AND job_type = ?';
    params.push(filters.job_type);
  }

  if (filters.location) {
    query += ' AND location LIKE ?';
    params.push(`%${filters.location}%`);
  }

  if (filters.category) {
    query += ' AND category = ?';
    params.push(filters.category);
  }

  return await runQuery(query, params);
};

exports.postJob = async (recruiterId, data) => {
  try {
    const { title, category, location, job_type, salary, max_applicants, max_positions, duration, deadline } = data;
    
    // Normalize job_type to ensure it matches one of the allowed ENUM values
    let normalizedJobType = job_type ? job_type.toLowerCase().trim() : 'full-time';
    
    // Validate job_type against allowed values
    const allowedTypes = ['full-time', 'part-time', 'internship', 'freelance'];
    if (!allowedTypes.includes(normalizedJobType)) {
      console.warn(`Invalid job_type: ${job_type}, defaulting to 'full-time'`);
      normalizedJobType = 'full-time'; // Default to full-time if invalid
    }
    
    // Create a skills JSON string if provided, otherwise empty array
    const skills = data.skills ? (
      Array.isArray(data.skills) ? 
        JSON.stringify(data.skills) : 
        data.skills
    ) : JSON.stringify([]);
    
    // First, we need to get the recruiter_id from the Recruiters table using the user_id
    const recruiters = await runQuery("SELECT id FROM Recruiters WHERE user_id = ?", [recruiterId]);
    
    if (!recruiters || recruiters.length === 0) {
      throw new Error("Recruiter profile not found. Please complete your profile setup first.");
    }
    
    const actualRecruiterId = recruiters[0].id;
    
    // Call the transaction procedure for job posting with normalized job_type
    try {
      await callProcedure('post_job_transaction', [
        actualRecruiterId,
        title,
        category,
        location,
        parseInt(salary, 10),
        normalizedJobType, // Use normalized job_type
        skills
      ]);
      
      // Get the newly created job ID
      const [jobs] = await runQuery(
        "SELECT id FROM Jobs WHERE recruiter_id = ? ORDER BY date_of_posting DESC LIMIT 1",
        [actualRecruiterId]
      );
      
      const jobId = jobs.length > 0 ? jobs[0].id : null;
      
      return { 
        id: jobId,
        title,
        category,
        location,
        salary,
        job_type: normalizedJobType // Return normalized job_type
      };
    } catch (error) {
      console.error("Error calling post_job_transaction procedure:", error);
      
      // Fallback to direct SQL if procedure fails
      const query = `
        INSERT INTO Jobs (
          recruiter_id, title, category, location, max_applicants, 
          max_positions, job_type, duration, salary, deadline
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
    
      const params = [
        actualRecruiterId,
        title,
        category,
        location,
        max_applicants,
        max_positions,
        normalizedJobType, // Use normalized job_type
        duration,
        salary,
        deadline
      ];
    
      const result = await runQuery(query, params);
      
      // If we have skills, insert them
      if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
        const jobId = result.insertId;
        const skillInserts = data.skills.map(skill => 
          runQuery("INSERT INTO JobSkillsets (job_id, skill) VALUES (?, ?)", [jobId, skill])
        );
        await Promise.all(skillInserts);
      }
      
      return {
        id: result.insertId,
        title,
        category,
        location,
        salary,
        job_type: normalizedJobType // Return normalized job_type
      };
    }
  } catch (error) {
    console.error("Error in job posting:", error);
    throw error;
  }
};

// Optional (based on other controller methods)

exports.getJobsByCategory = async (category) => {
  const query = 'SELECT * FROM Jobs WHERE category = ?';
  return await runQuery(query, [category]);
};

exports.getJobById = async (id) => {
  const query = `
    SELECT j.*, 
    (SELECT COUNT(*) FROM Applications a WHERE a.job_id = j.id) AS active_applications,
    (SELECT COUNT(*) FROM Applications a WHERE a.job_id = j.id AND a.status = 'accepted') AS accepted_candidates
    FROM Jobs j 
    WHERE j.id = ?
  `;
  const result = await runQuery(query, [id]);
  return result[0]; 
};

exports.getJobSkills = async (jobId) => {
  const query = `
    SELECT skill FROM JobSkillsets
    WHERE job_id = ?
  `;
  return await runQuery(query, [jobId]);
};

exports.updateJob = async (id, data) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  const query = `UPDATE Jobs SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);

  await runQuery(query, values);
  return { id, ...data };
};

exports.deleteJob = async (id) => {
  const query = 'DELETE FROM Jobs WHERE id = ?';
  await runQuery(query, [id]);
};
