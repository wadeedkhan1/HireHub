const { runQuery, callProcedure } = require("../db/query");

exports.getProfile = async (userId) => {
  const result = await runQuery(
    "SELECT name, contact_number, bio FROM Recruiters WHERE user_id = ?",
    [userId]
  );
  return result[0];
};

exports.updateProfile = async (userId, data) => {
  const fields = [];
  const values = [];

  for (const key in data) {
    if (["name", "contact_number", "bio"].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  values.push(userId);

  const sql = `UPDATE Recruiters SET ${fields.join(", ")} WHERE user_id = ?`;
  return await runQuery(sql, values);
};

/**
 * Get recruiter dashboard using stored procedure
 * @param {number} recruiterId - Recruiter user ID
 * @returns {Object} Dashboard data with posted jobs and recent applications
 */
exports.getRecruiterDashboard = async (recruiterId) => {
  try {
    const results = await callProcedure('get_recruiter_dashboard', [recruiterId]);
    
    return {
      postedJobs: results[0],       // Jobs posted by the recruiter with applicant counts
      recentApplications: results[1] // Recent applications for the recruiter's jobs
    };
  } catch (error) {
    console.error('Error getting recruiter dashboard:', error);
    throw error;
  }
};
