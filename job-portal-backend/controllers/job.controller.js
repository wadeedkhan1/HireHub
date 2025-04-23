const jobService = require("../services/job.service");

// GET /api/jobs?salaryMin=50000&salaryMax=100000&jobType=full-time&location=NYC&category=Engineering
exports.searchJobs = async (req, res, next) => {
  try {
    const {
      salaryMin,
      salaryMax,
      jobType,
      location,
      category
    } = req.query;

    const filters = {};

    if (salaryMin) filters.salaryMin = parseInt(salaryMin, 10);
    if (salaryMax) filters.salaryMax = parseInt(salaryMax, 10);
    if (jobType) filters.job_type = jobType;
    if (location) filters.location = location;
    if (category) filters.category = category;

    const jobs = await jobService.searchJobs(filters);
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

exports.getByCategory = async (req, res, next) => {
  try {
    const jobs = await jobService.getJobsByCategory(req.params.category);
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.json(job);
  } catch (err) {
    next(err);
  }
};

exports.getJobSkills = async (req, res, next) => {
  try {
    const skills = await jobService.getJobSkills(req.params.id);
    res.json(skills);
  } catch (err) {
    next(err);
  }
};

exports.postJob = async (req, res, next) => {
  try {
    const recruiterId = req.body.user_id;
    const job = await jobService.postJob(recruiterId, req.body);
    res.status(201).json({ message: "Job posted", job });
  } catch (err) {
    next(err);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    res.json({ message: "Job updated", job });
  } catch (err) {
    next(err);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    await jobService.deleteJob(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    next(err);
  }
};
