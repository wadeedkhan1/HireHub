const pool = require("../db/connection");
const { callProcedure } = require("../db/query");

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

  try {
    // Call the transaction procedure for user registration
    await callProcedure('register_user_transaction', [
      email,
      password,
      user_type,
      name,
      contact_number || '',
      bio_or_skills || ''
    ]);
    
    // Get the user ID of the newly registered user
    const [userResult] = await pool.execute("SELECT id FROM Users WHERE email = ?", [email]);
    
    if (!userResult.length) {
      throw new Error("User registration failed");
    }
    
    const userId = userResult[0].id;
    
    // Handle additional fields for applicants if needed
    if (user_type === 'applicant' && (resume || profile)) {
      await pool.execute(
        "UPDATE JobApplicants SET resume = ?, profile = ? WHERE user_id = ?",
        [resume || null, profile || null, userId]
      );
    }
    
    return userId;
  } catch (error) {
    console.error("Error in register transaction:", error);
    throw error;
  }
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
