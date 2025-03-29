const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Create Job
router.post('/', async (req, res) => {
    const { recruiter_id, title, max_applicants, max_positions, deadline, job_type, duration, salary } = req.body;
    try {
        await db.execute(
            "INSERT INTO Jobs (recruiter_id, title, max_applicants, max_positions, deadline, job_type, duration, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [recruiter_id, title, max_applicants, max_positions, deadline, job_type, duration, salary]
        );
        res.status(201).json({ message: "Job created successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Jobs
router.get('/', async (req, res) => {
    try {
        const [jobs] = await db.execute("SELECT * FROM Jobs");
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Job
router.put('/:id', async (req, res) => {
    const { title, max_applicants, max_positions, deadline, job_type, duration, salary } = req.body;
    try {
        await db.execute(
            "UPDATE Jobs SET title = ?, max_applicants = ?, max_positions = ?, deadline = ?, job_type = ?, duration = ?, salary = ? WHERE id = ?",
            [title, max_applicants, max_positions, deadline, job_type, duration, salary, req.params.id]
        );
        res.status(200).json({ message: "Job updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Job
router.delete('/:id', async (req, res) => {
    try {
        await db.execute("DELETE FROM Jobs WHERE id = ?", [req.params.id]);
        res.status(200).json({ message: "Job deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
