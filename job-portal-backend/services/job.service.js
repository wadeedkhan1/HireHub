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
  const { title, category, location, max_applicants, max_positions, job_type, duration, salary, deadline } = data;

  
  const query = `
    INSERT INTO Jobs (recruiter_id, title, category, location, max_applicants, max_positions, job_type, duration, salary, deadline)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    recruiterId,
    title,
    category,
    location,
    max_applicants,
    max_positions,
    job_type,
    duration,
    salary,
    deadline
  ];

  const result = await runQuery(query, params);

  return result;
};
// Optional (based on other controller methods)

exports.getJobsByCategory = async (category) => {
  const query = 'SELECT * FROM Jobs WHERE category = ?';
  return await runQuery(query, [category]);
};

exports.getJobById = async (id) => {
  const query = 'SELECT * FROM Jobs WHERE id = ?';
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
