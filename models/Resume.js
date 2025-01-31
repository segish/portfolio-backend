const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    file: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resume', resumeSchema); 