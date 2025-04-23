const express = require("express");
const router = express.Router();
const recruiterController = require("../controllers/recruiter.controller");

router.get("/:userId", recruiterController.getProfile);
router.put("/:userId", recruiterController.updateProfile);
router.post("/:userId", recruiterController.updateProfile);

module.exports = router;
