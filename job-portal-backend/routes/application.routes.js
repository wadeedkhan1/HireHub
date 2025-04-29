const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application.controller");

// Applicant actions
router.post("/jobs/:jobId/apply", applicationController.applyForJob);
router.get("/:applicationId", applicationController.getApplicationDetails);
router.put("/:applicationId/status", applicationController.updateApplicationStatus);
router.delete("/:applicationId", applicationController.cancelApplication);

// Get applications by user or recruiter
router.get("/user/:userId", applicationController.getApplicationsByUser);
router.get("/recruiter/:recruiterId", applicationController.getApplicationsByRecruiter);
router.get("/jobs/:jobId", applicationController.getApplicationsByJob);

module.exports = router;
