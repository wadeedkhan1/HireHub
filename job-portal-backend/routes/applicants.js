const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Create Applicant
router.post('/', async (req, res) => {
    const { user_id, name, skills, resume, profile } = req.body;
    try {
        await db.execute(
            "INSERT INTO JobApplicants (user_id, name, skills, resume, profile) VALUES (?, ?, ?, ?, ?)",
            [user_id, name, skills, resume, profile]
        );
        res.status(201).json({ message: "Applicant created successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Applicants
router.get('/', async (req, res) => {
    try {
        const [applicants] = await db.execute("SELECT * FROM JobApplicants");
        res.status(200).json(applicants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Applicant
router.put('/:id', async (req, res) => {
    const { name, skills, resume, profile } = req.body;
    try {
        await db.execute(
            "UPDATE JobApplicants SET name = ?, skills = ?, resume = ?, profile = ? WHERE id = ?",
            [name, skills, resume, profile, req.params.id]
        );
        res.status(200).json({ message: "Applicant updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Applicant
router.delete('/:id', async (req, res) => {
    try {
        await db.execute("DELETE FROM JobApplicants WHERE id = ?", [req.params.id]);
        res.status(200).json({ message: "Applicant deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
