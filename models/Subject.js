const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    year: { type: Number, required: true, enum: [1, 2, 3, 4] },
    name: { type: String, required: true },
    pdf: { type: String },
    yt: { type: String },
    suggestion: { type: String }
});

module.exports = mongoose.model('Subject', subjectSchema);