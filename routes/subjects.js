const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');

// Get Render URL from environment variable
const RENDER_URL = process.env.RENDER_URL || 'https://notes-app-techno.onrender.com';

router.get('/', async (req, res) => {
    try {
        console.log("GET /subjects called");
        
        // Fetch from Render backend
        const response = await fetch(`${RENDER_URL}/api/subjects`);
        const subjects = await response.json();
        
        console.log("Subjects found:", subjects.length);
        res.json(subjects);
    } catch (error) {
        console.error("SUBJECTS ERROR:", error.message);
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const response = await fetch(`${RENDER_URL}/api/subjects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const subject = await response.json();
        res.status(201).json({ message: 'Subject added!', subject });
    } catch (error) {
        console.error("SUBJECTS POST ERROR:", error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
