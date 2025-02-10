const express = require('express');
const Task = require('../models/Task');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();
 
// Create a Task
router.post('/', protect, async (req, res) => {
  const { title } = req.body;
  try {
const taskExists = await Task.findOne({ title, userId: req.user.id });
    if (taskExists) return res.status(400).json({ message: 'Task already exists' });
 
const newTask = new Task({ title, userId: req.user.id });
    await newTask.save();
 
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});
 
// Mark/Unmark a Task as Completed
router.patch('/:id', protect, async (req, res) => {
  try {
const task = await Task.findById(req.params.id);
if (!task || task.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }
 
    task.completed = !task.completed;
    await task.save();
 
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});
 
// Get Tasks with Pagination and Search
router.get('/', protect, async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  try {
    const tasks = await Task.find({
userId: req.user.id,
      title: { $regex: search, $options: 'i' },
    })
      .skip((page - 1) * limit)
      .limit(Number(limit));
 
    const totalTasks = await Task.countDocuments({
userId: req.user.id,
      title: { $regex: search, $options: 'i' },
    });
 
    res.json({
      tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTasks / limit),
        totalItems: totalTasks,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});
 
module.exports = router;
