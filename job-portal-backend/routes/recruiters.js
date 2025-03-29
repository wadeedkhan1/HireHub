const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Create Recruiter
router.post('/', async (req, res) => {
    const { user_id, name, contact_number, bio } = req.body;
    try {
        await db.execute(
            "INSERT INTO Recruiters (user_id, name, contact_number, bio) VALUES (?, ?, ?, ?)",
            [user_id, name, contact_number, bio]
        );
        res.status(201).json({ message: "Recruiter created successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Recruiters
router.get('/', async (req, res) => {
    try {
        const [recruiters] = await db.execute("SELECT * FROM Recruiters");
        res.status(200).json(recruiters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Recruiter
router.put('/:id', async (req, res) => {
    const { name, contact_number, bio } = req.body;
    try {
        await db.execute(
            "UPDATE Recruiters SET name = ?, contact_number = ?, bio = ? WHERE id = ?",
            [name, contact_number, bio, req.params.id]
        );
        res.status(200).json({ message: "Recruiter updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Recruiter
router.delete('/:id', async (req, res) => {
    try {
        await db.execute("DELETE FROM Recruiters WHERE id = ?", [req.params.id]);
        res.status(200).json({ message: "Recruiter deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
