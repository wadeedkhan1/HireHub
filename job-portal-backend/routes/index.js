const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/jobs', require('./job.routes'));
router.use('/recruiters', require('./recruiter.routes'));
router.use('/applicants', require('./applicant.routes'));
router.use('/applications', require('./application.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/ratings', require('./rating.routes'));

module.exports = router;
