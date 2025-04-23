const recruiterService = require("../services/recruiter.service");

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await recruiterService.getProfile(req.params.userId);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await recruiterService.updateProfile(userId, req.body);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: err.message || "Error updating profile" });
  }
};
