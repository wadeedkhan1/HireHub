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
  const procName =
    userType === "recruiter" ? "get_recruiter_dashboard" : "get_user_dashboard";

  const resultSets = await callProcedure(procName, [userId]);

  if (userType === "recruiter") {
    return {
      jobsWithApplicantCount: resultSets[0],
      recentApplications: resultSets[1],
    };
  } else {
    return {
      myApplications: resultSets[0],
      recentJobs: resultSets[1],
      notifications: resultSets[2],
    };
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
