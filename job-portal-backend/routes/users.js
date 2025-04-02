const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Create User
router.post('/', async (req, res) => {
    const { email, password, type } = req.body;
    try {
        await db.query(
            "INSERT INTO Users (email, password, type) VALUES (?, ?, ?)", 
            [email, password, type]
        );
        res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Users
router.get('/', async (req, res) => {
    try {
        const [users] = await db.query("SELECT * FROM Users");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get User by ID
router.get('/:id', async (req, res) => {
    try {
        const [user] = await db.query("SELECT * FROM Users WHERE id = ?", [req.params.id]);
        res.status(200).json(user[0] || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update User
router.put('/:id', async (req, res) => {
    const { email, password, type } = req.body;
    try {
        await db.query(
            "UPDATE Users SET email = ?, password = ?, type = ? WHERE id = ?", 
            [email, password, type, req.params.id]
        );
        res.status(200).json({ message: "User updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete User
router.delete('/:id', async (req, res) => {
    try {
        await db.execute("DELETE FROM Users WHERE id = ?", [req.params.id]);
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
