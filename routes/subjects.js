const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');

// GET all subjects
router.get('/', async (req, res) => {
    try {
        console.log("GET /subjects called");
        const { year } = req.query;
        const subjects = await Subject.find(year ? { year: Number(year) } : {});
        console.log("Subjects found:", subjects.length);
        res.json(subjects);
    } catch (error) {
        console.error("SUBJECTS ERROR:", error.message);
        res.status(500).json({ message: error.message });
    }
});

// POST - create new subject
router.post('/', async (req, res) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();
        res.status(201).json({ message: 'Subject added!', subject });
    } catch (error) {
        console.error("SUBJECTS POST ERROR:", error.message);
        res.status(500).json({ message: error.message });
    }
});

// ✅ PUT - update existing subject (needed to add pyqs/importantTopics to old subjects)
router.put('/:id', async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(
            req.params.id,
            {
                year:            req.body.year,
                name:            req.body.name,
                pdf:             req.body.pdf,
                yt:              req.body.yt,
                pyqs:            req.body.pyqs,             // ✅ new
                importantTopics: req.body.importantTopics,  // ✅ new
                suggestion:      req.body.suggestion
            },
            { new: true }  // returns the updated document
        );
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        res.json({ message: 'Subject updated!', subject });
    } catch (error) {
        console.error("SUBJECTS PUT ERROR:", error.message);
        res.status(500).json({ message: error.message });
    }
});

// ✅ DELETE - remove a subject
router.delete('/:id', async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subject deleted!' });
    } catch (error) {
        console.error("SUBJECTS DELETE ERROR:", error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
