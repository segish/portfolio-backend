const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    keyFeatures: [{
        type: String,
        required: true
    }],
    githubLink: {
        type: String,
        required: true
    },
    demoLink: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema); 