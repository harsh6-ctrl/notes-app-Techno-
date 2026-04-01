const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');

// ✅ GET subjects (DIRECT from MongoDB)
router.get('/', async (req, res) => {
    try {
        console.log("GET /subjects called");

        const { year } = req.query;

        const subjects = await Subject.find(
            year ? { year: Number(year) } : {}
        );

        console.log("Subjects found:", subjects.length);

        res.json(subjects);

    } catch (error) {
        console.error("SUBJECTS ERROR:", error.message);
        res.status(500).json({ message: error.message });
    }
});

// ✅ POST subject (DIRECT save)
router.post('/', async (req, res) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();

        res.status(201).json({
            message: 'Subject added!',
            subject
        });

    } catch (error) {
        console.error("SUBJECTS POST ERROR:", error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
