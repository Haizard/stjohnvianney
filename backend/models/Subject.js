const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['CORE', 'OPTIONAL'],
    default: 'CORE'
  },
  description: String,
  passMark: {
    type: Number,
    default: 40
  },
  gradingSystem: {
    A: { type: Number, min: 75, max: 100 },
    B: { type: Number, min: 65, max: 74 },
    C: { type: Number, min: 45, max: 64 },
    D: { type: Number, min: 30, max: 44 },
    F: { type: Number, min: 0, max: 29 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
