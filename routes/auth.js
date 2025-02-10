const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
 
// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });
 
    const newUser = new User({ email, password });
    await newUser.save();
 
    const payload = { user: { id: newUser._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
 
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});
 
// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
 
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
 
    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
 
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});
 
module.exports = router;
