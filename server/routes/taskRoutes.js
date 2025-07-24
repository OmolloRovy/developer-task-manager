 const express = require('express');
const { createTask, getMyTasks, getAllTasks } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, getMyTasks);
router.get('/all', protect, authorize('admin'), getAllTasks);
router.post('/', protect, createTask);

module.exports = router;
