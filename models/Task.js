const mongoose = require('mongoose');
 
const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true, unique: true },
  completed: { type: Boolean, default: false },
});
 
module.exports = mongoose.model('Task', taskSchema);
