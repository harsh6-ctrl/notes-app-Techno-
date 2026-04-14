const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    pyqs: { type: [String], default: [] },
    importantTopics: { type: [String], default: [] }
});

module.exports = mongoose.model('Subject', subjectSchema);