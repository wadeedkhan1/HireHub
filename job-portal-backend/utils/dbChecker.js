const db = require('../db/connection');

/**
 * Check if a stored procedure exists in the database
 * @param {string} procedureName - Name of the procedure to check
 * @returns {Promise<boolean>} - True if procedure exists
 */
const checkProcedureExists = async (procedureName) => {
  try {
    const [results] = await db.query(`
      SELECT ROUTINE_NAME
      FROM information_schema.ROUTINES
      WHERE ROUTINE_SCHEMA = ? AND ROUTINE_NAME = ? AND ROUTINE_TYPE = 'PROCEDURE'
    `, [process.env.DB_NAME, procedureName]);
    
    return results.length > 0;
  } catch (error) {
    console.error(`Error checking procedure ${procedureName}:`, error);
    return false;
  }
};

/**
 * Check if all required procedures exist
 * @returns {Promise<{missing: string[], existing: string[]}>} - Lists of missing and existing procedures
 */
const checkAllProcedures = async () => {
  const requiredProcedures = [
    'get_user_dashboard',
    'get_recruiter_dashboard',
    'update_application_status',
    'register_user_transaction',
    'post_job_transaction',
    'apply_job_transaction'
  ];
  
  const missing = [];
  const existing = [];
  
  for (const proc of requiredProcedures) {
    const exists = await checkProcedureExists(proc);
    if (exists) {
      existing.push(proc);
    } else {
      missing.push(proc);
    }
  }
  
  return { missing, existing };
};

module.exports = {
  checkProcedureExists,
  checkAllProcedures
}; 