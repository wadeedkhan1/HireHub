const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating.controller");

router.post("/", ratingController.createRating);
router.get("/:userId", ratingController.getRatingsForUser);

module.exports = router;
