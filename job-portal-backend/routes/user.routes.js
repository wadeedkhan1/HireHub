const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/:id/dashboard", userController.getDashboard);
router.get("/:id/notifications", userController.getNotifications);
router.get("/:id/notifications/unread", userController.getUnreadNotifications);
router.patch(
  "/:id/notifications/:notificationId/read",
  userController.markNotificationRead
);
router.patch(
  "/:id/notifications/read-all",
  userController.markAllNotificationsRead
);

// Profile routes
router.get("/:id/profile", userController.getProfile);
router.put("/:id/profile", userController.updateProfile);

module.exports = router;
