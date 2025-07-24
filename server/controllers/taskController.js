const mongoose = require('mongoose');
const Task = require('../models/Task');

//POST /api/tasks
exports.createTask = async (req, res) => {
const task = await Task.create({...req.body, user: req.user.id });
res.json( task );
};

//GET /api/tasks/me
exports.getMyTasks = async (req, res) => {
    const tasks = await Task.find({ owner: req.user.id });
    res.status(200).json(tasks);
};

//GET /api/tasks/all
exports.getAllTasks = async (req,res)=>{
    const tasks = await Task.find().populate("owner", "email");
    res.status(200).json(tasks);
}