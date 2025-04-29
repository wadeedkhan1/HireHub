const userService = require("../services/user.service");

exports.getDashboard = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Determine user type from database
    const userType = await userService.getUserType(userId);

    const dashboard = await userService.getDashboard(userType, userId);
    res.json(dashboard);
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: err.message || "Error retrieving dashboard data" });
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const result = await userService.getNotifications(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getUnreadNotifications = async (req, res, next) => {
  try {
    const result = await userService.getUnreadNotifications(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.markNotificationRead = async (req, res, next) => {
  try {
    await userService.markNotificationRead(
      req.params.id,
      req.params.notificationId
    );
    res.json({ message: "Marked as read" });
  } catch (err) {
    next(err);
  }
};

exports.markAllNotificationsRead = async (req, res, next) => {
  try {
    await userService.markAllNotificationsRead(req.params.id);
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
};

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Determine user type from database
    const userType = await userService.getUserType(userId);
    
    // Get profile data
    const profile = await userService.getProfile(userId, userType);
    res.json(profile);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: err.message || "Error retrieving profile data" });
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Determine user type from database
    const userType = await userService.getUserType(userId);
    
    // Update profile data
    const updatedProfile = await userService.updateProfile(userId, userType, req.body);
    res.json({ message: "Profile updated successfully", profile: updatedProfile });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: err.message || "Error updating profile data" });
  }
};
