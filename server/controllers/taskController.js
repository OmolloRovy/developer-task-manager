const mongoose = require('mongoose');
const Task = require('../models/Task');

//POST /api/tasks
exports.createTask = async (req, res) => {
    // Ensure req.user.id is available from the 'protect' middleware
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authorized, user ID not found in token.' });
    }

    try {
        const task = await Task.create({
            ...req.body,
            owner: req.user.id // <-- FIX: Changed 'user' to 'owner'
        });
        res.status(201).json(task); // Use 201 Created for new resources
    } catch (error) {
        console.error("Error creating task:", error);
        // More specific error handling for Mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error creating task.' });
    }
};

//GET /api/tasks/me
exports.getMyTasks = async (req, res) => {
    // Ensure req.user.id is available
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authorized, user ID not found in token.' });
    }

    try {
        const tasks = await Task.find({ owner: req.user.id });
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        res.status(500).json({ message: 'Server error fetching tasks.' });
    }
};

//GET /api/tasks/all
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate("owner", "email");
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching all tasks:", error);
        res.status(500).json({ message: 'Server error fetching all tasks.' });
    }
};