const db = require('./connection');

/**
 * Calls a stored procedure with dynamic parameters.
 * @param {string} name - Procedure name (e.g. "post_job_transaction")
 * @param {Array<any>} params - Ordered parameter values
 */
const callProcedure = async (name, params = []) => {
    const placeholders = params.map(() => '?').join(',');
    const sql = `CALL ${name}(${placeholders})`;
    const [results] = await db.execute(sql, params);
    
    // MySQL stored procedures can return multiple result sets
    // Each result set is represented as an array in results
    return results;
};


const runQuery = async (query, params = []) => {
    const [rows] = await db.execute(query, params);
    return rows;
};

module.exports = {
    callProcedure,
    runQuery
};
