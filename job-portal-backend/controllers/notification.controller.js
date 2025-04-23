const notificationService = require("../services/notification.service");

exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.query.user_id;
    const result = await notificationService.getNotifications(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getUnreadNotifications = async (req, res, next) => {
  try {
    const userId = req.query.user_id;
    const result = await notificationService.getUnreadNotifications(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.markNotificationRead = async (req, res, next) => {
  try {
    const userId = req.body.user_id;
    await notificationService.markNotificationRead(
      userId,
      req.params.notificationId
    );
    res.json({ message: "Marked as read" });
  } catch (err) {
    next(err);
  }
};

exports.markAllNotificationsRead = async (req, res, next) => {
  try {
    const userId = req.body.user_id;
    await notificationService.markAllNotificationsRead(userId);
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
};
