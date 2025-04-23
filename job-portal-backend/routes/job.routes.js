const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");

router.get("/", jobController.searchJobs); // with filters
router.get("/categories/:category", jobController.getByCategory);
router.get("/:id", jobController.getJobById);
router.get("/:id/skills", jobController.getJobSkills);

router.post("/", jobController.postJob);
router.put("/:id", jobController.updateJob);
router.delete("/:id", jobController.deleteJob);

module.exports = router;
