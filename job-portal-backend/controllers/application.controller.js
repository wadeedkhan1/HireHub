const applicationService = require("../services/application.service");

exports.applyForJob = async (req, res, next) => {
  try {
    const applicantId = req.body.user_id;
    const result = await applicationService.applyForJob(
      applicantId,
      req.params.jobId
    );
    res.status(201).json({ message: "Applied successfully", result });
  } catch (err) {
    next(err);
  }
};

exports.cancelApplication = async (req, res, next) => {
  try {
    await applicationService.updateStatus(
      req.params.applicationId,
      "cancelled"
    );
    res.json({ message: "Application cancelled" });
  } catch (err) {
    next(err);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    await applicationService.updateStatus(req.params.applicationId, status);
    res.json({ message: `Application status updated to ${status}` });
  } catch (err) {
    next(err);
  }
};

exports.getApplicationsByUser = async (req, res, next) => {
  try {
    const userId = req.query.user_id;
    const apps = await applicationService.getApplicationsByUser(userId);
    res.json(apps);
  } catch (err) {
    next(err);
  }
};

exports.getApplicationsByRecruiter = async (req, res, next) => {
  try {
    const recruiterId = req.query.user_id;
    const apps = await applicationService.getApplicationsByRecruiter(
      recruiterId
    );
    res.json(apps);
  } catch (err) {
    next(err);
  }
};
