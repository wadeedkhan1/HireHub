const { runQuery } = require("../db/query");

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
