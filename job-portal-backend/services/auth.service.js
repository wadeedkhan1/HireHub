const pool = require("../db/connection");

exports.register = async ({
  email,
  password,
  user_type,
  name,
  contact_number,
  bio_or_skills,
  resume,
  profile,
}) => {
  console.log("register() payload:", { email, password, user_type, name });

  if (!email || !password || !user_type || !name) {
    throw new Error(
      "Missing required fields: email, password, user_type, or name"
    );
  }

  // Check if user already exists
  const [existing] = await pool.execute("SELECT * FROM Users WHERE email = ?", [
    email,
  ]);
  if (existing.length) {
    throw new Error("User with this email already exists");
  }

  // Insert into Users
  const [userResult] = await pool.execute(
    "INSERT INTO Users (email, password, type) VALUES (?, ?, ?)",
    [email, password, user_type]
  );

  const userId = userResult.insertId;

  // Recruiter or Applicant branch
  if (user_type === "recruiter") {
    await pool.execute(
      "INSERT INTO Recruiters (user_id, name, contact_number, bio) VALUES (?, ?, ?, ?)",
      [userId, name, contact_number ?? null, bio_or_skills ?? null]
    );
  } else if (user_type === "applicant") {
    await pool.execute(
      "INSERT INTO JobApplicants (user_id, name, skills, resume, profile) VALUES (?, ?, ?, ?, ?)",
      [userId, name, bio_or_skills ?? null, resume ?? null, profile ?? null]
    );
  }

  return userId;
};

exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Missing email or password");
  }

  const [rows] = await pool.execute("SELECT * FROM Users WHERE email = ?", [
    email,
  ]);
  const user = rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  if (user.password !== password) {
    throw new Error("Invalid credentials");
  }

  return {
    id: user.id,
    type: user.type,
    message: "Login successful",
  };
};
