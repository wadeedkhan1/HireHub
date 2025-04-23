const applicantService = require("../services/applicant.service");

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await applicantService.getProfile(req.params.userId);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const data = req.body;

    const result = await applicantService.updateProfile(userId, data);
    res.json(result);
  } catch (err) {
    console.error("Error caught:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.addEducation = async (req, res, next) => {
  try {
    const applicantId = req.params.userId;
    const result = await applicantService.addEducation(applicantId, req.body);
    res.status(201).json({ message: "Education added", education: result });
  } catch (err) {
    console.error("Error caught:", err);
    next(err);
  }
};

exports.getEducationList = async (req, res, next) => {
  try {
    const result = await applicantService.getEducationList(req.params.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.updateEducation = async (req, res, next) => {
  try {
    await applicantService.updateEducation(
      req.params.userId,
      req.params.eduId,
      req.body
    );
    res.json({ message: "Education updated" });
  } catch (err) {
    next(err);
  }
};

exports.deleteEducation = async (req, res, next) => {
  try {
    await applicantService.deleteEducation(req.params.userId, req.params.eduId);
    res.json({ message: "Education deleted" });
  } catch (err) {
    next(err);
  }
};
