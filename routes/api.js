const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Project = require('../models/Project');
const Resume = require('../models/Resume');
const { deleteFile } = require('../utils/fileHelper');

// Create upload directories if they don't exist
const createUploadDirectories = () => {
    const directories = ['uploads/resume', 'uploads/projects'];
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

// Create directories on startup
createUploadDirectories();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = file.fieldname === 'resume' ? 'uploads/resume' : 'uploads/projects';
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Project routes
router.post('/projects', upload.single('image'), async (req, res) => {
    try {
        const project = new Project({
            title: req.body.title,
            description: req.body.description,
            image: req.file.path,
            keyFeatures: JSON.parse(req.body.keyFeatures),
            githubLink: req.body.githubLink,
            demoLink: req.body.demoLink
        });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/projects/:id', upload.single('image'), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const updateData = {
            title: req.body.title,
            description: req.body.description,
            keyFeatures: JSON.parse(req.body.keyFeatures),
            githubLink: req.body.githubLink,
            demoLink: req.body.demoLink
        };

        if (req.file) {
            // Delete old image before updating
            deleteFile(project.image);
            updateData.image = req.file.path;
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Delete the image file
        deleteFile(project.image);

        // Delete the project from database
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Resume routes
router.post('/resume', upload.single('resume'), async (req, res) => {
    try {
        // Delete old resume file if exists
        const oldResume = await Resume.findOne();
        if (oldResume) {
            deleteFile(oldResume.file);
            await Resume.deleteMany({});
        }

        const resume = new Resume({
            file: req.file.path
        });
        await resume.save();
        res.status(201).json(resume);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/resume', async (req, res) => {
    try {
        const resume = await Resume.findOne();
        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 