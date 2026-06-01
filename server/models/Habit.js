const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String },
  color: { type: String },
  icon: { type: String },
  emoji: { type: String },
  goal: { type: Number, default: 30 },
  completions: { 
    type: Map, 
    of: Boolean, 
    default: {} 
  }
});

module.exports = mongoose.model('Habit', HabitSchema);
