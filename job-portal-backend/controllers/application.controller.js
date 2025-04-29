const applicationService = require("../services/application.service");

exports.applyForJob = async (req, res, next) => {
  try {
    console.log("Application request received:", {
      params: req.params,
      body: req.body,
      headers: req.headers,
      userId: req.userId
    });
    
    // Get user ID - try all possible sources
    let applicantId = null;
    
    // 1. Try from auth middleware
    if (req.userId) {
      applicantId = req.userId;
      console.log("Using user ID from auth middleware:", applicantId);
    } 
    // 2. Try from request body
    else if (req.body.user_id) {
      applicantId = req.body.user_id;
      console.log("Using user ID from request body:", applicantId);
    }
    // 3. Still no user ID, return error
    else {
      console.error("No user ID found in request");
      return res.status(401).json({ 
        message: "User ID not found. Please sign in again and retry." 
      });
    }
    
    // Get job ID from params or body
    const jobId = req.params.jobId || req.body.jobId;
    
    if (!jobId) {
      console.error("No job ID found in request");
      return res.status(400).json({ message: "Job ID is required" });
    }
    
    // Store cover letter if provided (check both formats)
    const coverLetter = req.body.coverLetter || req.body.cover_letter || null;
    
    console.log(`Processing application: User=${applicantId}, Job=${jobId}, Has CoverLetter=${!!coverLetter}`);
    
    try {
      const result = await applicationService.applyForJob(
        applicantId,
        jobId,
        coverLetter
      );
      
      console.log("Application submitted successfully:", result);
      res.status(201).json({ message: "Applied successfully", result });
    } catch (serviceError) {
      console.error("Application service error:", serviceError.message);
      res.status(400).json({ message: serviceError.message || "Failed to submit application" });
    }
  } catch (err) {
    console.error("Application controller error:", err.message);
    res.status(500).json({ message: "Failed to process your application. Please try again." });
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

exports.getApplicationDetails = async (req, res, next) => {
  try {
    const applicationId = req.params.applicationId;
    const application = await applicationService.getApplicationDetails(applicationId);
    res.json(application);
  } catch (err) {
    next(err);
  }
};

exports.getApplicationsByJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    console.log("Getting applications for job:", jobId);
    
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }
    
    // Parse job ID to ensure it's a valid integer
    const parsedJobId = parseInt(jobId, 10);
    if (isNaN(parsedJobId)) {
      console.error(`Invalid job ID format: ${jobId}`);
      return res.status(400).json({ message: "Invalid job ID format" });
    }
    
    const applications = await applicationService.getApplicationsByJob(parsedJobId);
    console.log(`Found ${applications.length} applications for job ${jobId}`);
    return res.json(applications);
  } catch (err) {
    console.error("Error in getApplicationsByJob:", err.message);
    return res.status(500).json({ message: "Failed to load job applicants" });
  }
};
