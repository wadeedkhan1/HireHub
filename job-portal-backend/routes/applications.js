const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Create Application
router.post('/', async (req, res) => {
    const { user_id, recruiter_id, job_id, sop } = req.body;
    try {
        await db.execute(
            "INSERT INTO Applications (user_id, recruiter_id, job_id, sop) VALUES (?, ?, ?, ?)",
            [user_id, recruiter_id, job_id, sop]
        );
        res.status(201).json({ message: "Application created successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Applications
router.get('/', async (req, res) => {
    try {
        const [applications] = await db.execute("SELECT * FROM Applications");
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
