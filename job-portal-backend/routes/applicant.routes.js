const express = require("express");
const router = express.Router();
const applicantController = require("../controllers/applicant.controller");

router.get("/:userId", applicantController.getProfile);
router.put("/:userId", applicantController.updateProfile);

router.post("/:userId/education", applicantController.addEducation);
router.get("/:userId/education", applicantController.getEducationList);
router.put("/:userId/education/:eduId", applicantController.updateEducation);
router.delete("/:userId/education/:eduId", applicantController.deleteEducation);

module.exports = router;
