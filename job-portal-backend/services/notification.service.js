const { runQuery } = require("../db/query");

exports.getNotifications = async (userId) => {
  return await runQuery(
    `SELECT id, message, is_read, created_at
     FROM Notifications
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );
};

exports.getUnreadNotifications = async (userId) => {
  return await runQuery(
    `SELECT id, message, created_at
     FROM Notifications
     WHERE user_id = ? AND is_read = FALSE
     ORDER BY created_at DESC`,
    [userId]
  );
};

exports.markNotificationRead = async (userId, notificationId) => {
  return await runQuery(
    `UPDATE Notifications
     SET is_read = TRUE
     WHERE user_id = ? AND id = ?`,
    [userId, notificationId]
  );
};

exports.markAllNotificationsRead = async (userId) => {
  return await runQuery(
    `UPDATE Notifications
     SET is_read = TRUE
     WHERE user_id = ? AND is_read = FALSE`,
    [userId]
  );
};
