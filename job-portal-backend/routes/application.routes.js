const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application.controller");

// Applicant actions
router.post("/jobs/:jobId/apply", applicationController.applyForJob);
router.patch("/:applicationId/cancel", applicationController.cancelApplication);
router.get("/user/:userId", applicationController.getApplicationsByUser);

// Recruiter actions
router.patch(
  "/:applicationId/status",
  applicationController.updateApplicationStatus
);
router.get(
  "/recruiter/:recruiterId",
  applicationController.getApplicationsByRecruiter
);

module.exports = router;
