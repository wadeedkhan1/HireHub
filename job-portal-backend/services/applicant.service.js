const { runQuery } = require("../db/query");

// Get a job applicant's profile by user_id
exports.getProfile = async (userId) => {
  const result = await runQuery(
    "SELECT name, skills, rating, resume, profile FROM JobApplicants WHERE user_id = ?",
    [userId]
  );
  return result[0];
};

// Update the applicant's profile
exports.updateProfile = async (userId, data) => {
  const allowedFields = ["name", "skills", "rating", "resume", "profile"];
  const fields = [];
  const values = [];

  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      let value = data[key];
      if (value === undefined) value = null; // convert undefined → null
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    throw new Error("No valid fields provided for update");
  }

  values.push(userId); // For WHERE user_id = ?

  const sql = `UPDATE JobApplicants SET ${fields.join(", ")} WHERE user_id = ?`;

  // Debug logs
  console.log("SQL:", sql);
  console.log("Values:", values);

  return await runQuery(sql, values);
};

// Add education entry for applicant
exports.addEducation = async (userId, data) => {
  const applicant = await runQuery(
    "SELECT id FROM JobApplicants WHERE user_id = ?",
    [userId]
  );
  const applicantId = applicant[0]?.id;

  if (!applicantId) throw new Error("Applicant not found");

  const { institution_name, start_year, end_year, field } = data;

  if (institution_name === undefined || start_year === undefined || end_year === undefined) {
    throw new Error("One or more required fields are missing");
  }

  console.log("Data received for education:", data);

  const [result] = await runQuery(
    "INSERT INTO Education (applicant_id, institution_name, field, start_year, end_year) VALUES (?, ?, ?, ?, ?)",
    [
      applicantId,
      institution_name,
      field || "Not Specified",
      start_year,
      end_year,
    ]
  );

  return {
    id: result.insertId,
    institution_name,
    field: field || "Not Specified",
    start_year,
    end_year,
  };
};

// Get list of education entries for applicant
exports.getEducationList = async (userId) => {
  const applicant = await runQuery(
    "SELECT id FROM JobApplicants WHERE user_id = ?",
    [userId]
  );
  const applicantId = applicant[0]?.id;

  if (!applicantId) return [];

  return await runQuery("SELECT * FROM Education WHERE applicant_id = ?", [
    applicantId,
  ]);
};

// Update specific education record
exports.updateEducation = async (userId, eduId, data) => {
  const applicant = await runQuery(
    "SELECT id FROM JobApplicants WHERE user_id = ?",
    [userId]
  );
  const applicantId = applicant[0]?.id;

  if (!applicantId) throw new Error("Applicant not found");

  const fields = [];
  const values = [];

  for (const key of ["institution_name", "field", "start_year", "end_year"]) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key] ?? null);
    }
  }

  if (fields.length === 0) {
    throw new Error("No valid fields provided for update");
  }

  values.push(applicantId, eduId);

  const sql = `UPDATE Education SET ${fields.join(
    ", "
  )} WHERE applicant_id = ? AND id = ?`;
  return await runQuery(sql, values);
};

// Delete education record
exports.deleteEducation = async (userId, eduId) => {
  const applicant = await runQuery(
    "SELECT id FROM JobApplicants WHERE user_id = ?",
    [userId]
  );
  const applicantId = applicant[0]?.id;

  if (!applicantId) throw new Error("Applicant not found");

  return await runQuery(
    "DELETE FROM Education WHERE applicant_id = ? AND id = ?",
    [applicantId, eduId]
  );
};
