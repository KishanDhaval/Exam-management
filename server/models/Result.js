// models/Result.js
import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  // index or ID of the option they chose
  selectedOption: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  // percentage score (0–100)
  score: {
    type: Number,
    required: true
  },
  // how long they took
  timeSpent: {
    type: Number, // in minutes
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  answers: [answerSchema]
}, {
  timestamps: true
});

export default mongoose.model('Result', resultSchema);
