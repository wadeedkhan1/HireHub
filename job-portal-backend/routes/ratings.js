const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Rate User or Job
router.post('/', async (req, res) => {
    const { category, receiver_id, sender_id, rating } = req.body;
    try {
        await db.execute(
            "INSERT INTO Ratings (category, receiver_id, sender_id, rating) VALUES (?, ?, ?, ?)",
            [category, receiver_id, sender_id, rating]
        );
        res.status(201).json({ message: "Rating added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
