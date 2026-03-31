const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  subjectId: {
    type: String,
    required: true,
  },
  notesViewed: {
    type: Boolean,
    default: false,
  },
  youtubeViewed: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  lastStudied: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Progress", progressSchema);