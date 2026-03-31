const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    rollNumber: { type: String, unique: true },
    year: { type: Number, enum: [1, 2, 3, 4] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);