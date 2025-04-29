const { callProcedure, runQuery } = require("../db/query");

// Get user type (recruiter or applicant)
exports.getUserType = async (userId) => {
  const recruiters = await runQuery(
    "SELECT id FROM Recruiters WHERE user_id = ?",
    [userId]
  );
  
  return recruiters && recruiters.length > 0 ? "recruiter" : "applicant";
};

// Dashboard handler
exports.getDashboard = async (userType, userId) => {
  try {
    // If user is a recruiter, we need to get the recruiter_id from user_id
    if (userType === "recruiter") {
      // Get recruiter ID from user ID
      const recruiters = await runQuery(
        "SELECT id FROM Recruiters WHERE user_id = ?",
        [userId]
      );
      
      if (!recruiters || recruiters.length === 0) {
        // If no recruiter record exists, return empty data
        return {
          jobsWithApplicantCount: [],
          recentApplications: [],
        };
      }
      
      const recruiterId = recruiters[0].id;
      
      // Call the procedure with the actual recruiter_id from the Recruiters table
      const resultSets = await callProcedure("get_recruiter_dashboard", [recruiterId]);
      
      return {
        jobsWithApplicantCount: resultSets[0],
        recentApplications: resultSets[1],
      };
    } else {
      // For applicants, the user_id is used directly
      const resultSets = await callProcedure("get_user_dashboard", [userId]);
      
      return {
        myApplications: resultSets[0],
        recentJobs: resultSets[1],
        notifications: resultSets[2],
      };
    }
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    throw error;
  }
};

// Notifications
exports.getNotifications = async (userId) => {
  return await runQuery(
    "SELECT id, message, is_read, created_at FROM Notifications WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
};

exports.getUnreadNotifications = async (userId) => {
  return await runQuery(
    "SELECT id, message, created_at FROM Notifications WHERE user_id = ? AND is_read = FALSE ORDER BY created_at DESC",
    [userId]
  );
};

exports.markNotificationRead = async (userId, notificationId) => {
  return await runQuery(
    "UPDATE Notifications SET is_read = TRUE WHERE id = ? AND user_id = ?",
    [notificationId, userId]
  );
};

exports.markAllNotificationsRead = async (userId) => {
  return await runQuery(
    "UPDATE Notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE",
    [userId]
  );
};

// Get user profile based on user type
exports.getProfile = async (userId, userType) => {
  try {
    // Get basic user data
    const userData = await runQuery(
      "SELECT id, email, type FROM Users WHERE id = ?",
      [userId]
    );
    
    if (!userData || userData.length === 0) {
      throw new Error("User not found");
    }
    
    let profile = userData[0];
    
    if (userType === "recruiter") {
      // Get recruiter specific data based on existing schema
      const recruiterData = await runQuery(
        `SELECT r.id as recruiter_id, r.name, r.contact_number as phone, r.bio 
         FROM Recruiters r 
         WHERE r.user_id = ?`,
        [userId]
      );
      
      if (recruiterData && recruiterData.length > 0) {
        profile = {
          ...profile,
          ...recruiterData[0],
          type: "recruiter"
        };
      }
    } else {
      // Get applicant specific data based on existing schema
      const applicantData = await runQuery(
        `SELECT ja.id as applicant_id, ja.name, ja.skills, ja.resume, ja.profile
         FROM JobApplicants ja
         WHERE ja.user_id = ?`,
        [userId]
      );
      
      if (applicantData && applicantData.length > 0) {
        profile = {
          ...profile,
          ...applicantData[0],
          location: "", // Not in schema but needed by frontend
          phone: "",    // Not in schema but needed by frontend
          experience: "", // Not in schema but needed by frontend
          bio: "",      // Not in schema but needed by frontend
          type: "jobseeker"
        };
      }
    }
    
    return profile;
  } catch (error) {
    console.error("Error getting profile:", error);
    throw error;
  }
};

// Update user profile based on user type - works with existing schema
exports.updateProfile = async (userId, userType, profileData) => {
  try {
    if (userType === "recruiter") {
      const { name, phone, bio } = profileData;
      
      // Check if recruiter record exists
      const recruiterExists = await runQuery(
        "SELECT id FROM Recruiters WHERE user_id = ?",
        [userId]
      );
      
      if (recruiterExists && recruiterExists.length > 0) {
        // Update existing record using the contact_number field in the schema
        await runQuery(
          `UPDATE Recruiters 
           SET name = COALESCE(?, name),
               contact_number = COALESCE(?, contact_number),
               bio = COALESCE(?, bio)
           WHERE user_id = ?`,
          [name, phone, bio, userId]
        );
      } else {
        // Create new recruiter record
        await runQuery(
          `INSERT INTO Recruiters (user_id, name, contact_number, bio)
           VALUES (?, ?, ?, ?)`,
          [userId, name || "", phone || "", bio || ""]
        );
      }
    } else {
      const { name, skills, resume, profile } = profileData;
      
      // Check if applicant record exists
      const applicantExists = await runQuery(
        "SELECT id FROM JobApplicants WHERE user_id = ?",
        [userId]
      );
      
      if (applicantExists && applicantExists.length > 0) {
        // Update existing record with the fields available in schema
        await runQuery(
          `UPDATE JobApplicants 
           SET name = COALESCE(?, name),
               skills = COALESCE(?, skills),
               resume = COALESCE(?, resume),
               profile = COALESCE(?, profile)
           WHERE user_id = ?`,
          [name, skills, resume, profile, userId]
        );
      } else {
        // Create new applicant record
        await runQuery(
          `INSERT INTO JobApplicants (user_id, name, skills, resume, profile)
           VALUES (?, ?, ?, ?, ?)`,
          [userId, name || "", skills || "", resume || "", profile || ""]
        );
      }
    }
    
    // Return the updated profile
    return await exports.getProfile(userId, userType);
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
