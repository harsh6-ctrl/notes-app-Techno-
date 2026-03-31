const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");

// CREATE or UPDATE progress
router.post("/", async (req, res) => {
  try {
    const { userId, subjectId, notesViewed, youtubeViewed } = req.body;

    if (!userId || !subjectId) {
      return res.status(400).json({ message: "userId and subjectId are required" });
    }

    let progress = await Progress.findOne({ userId, subjectId });

    if (progress) {
      progress.notesViewed = Boolean(notesViewed);
      progress.youtubeViewed = Boolean(youtubeViewed);
      progress.completed = Boolean(notesViewed) && Boolean(youtubeViewed);
      progress.lastStudied = Date.now();
      await progress.save();
    } else {
      progress = await Progress.create({
        userId,
        subjectId,
        notesViewed: Boolean(notesViewed),
        youtubeViewed: Boolean(youtubeViewed),
        completed: Boolean(notesViewed) && Boolean(youtubeViewed),
        lastStudied: Date.now(),
      });
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error("FULL ERROR:", error.message);
    res.status(500).json({ message: error.message, name: error.name });
  }
});

// GET progress by user
router.get("/:userId", async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.params.userId });
    res.status(200).json(progress);
  } catch (error) {
    console.error("FULL ERROR:", error.message);
    res.status(500).json({ message: error.message, name: error.name });
  }
});

module.exports = router;