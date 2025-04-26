// models/Question.js
import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },

  isCorrect: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  // for simple MCQs; for other types you can extend this
  options: [optionSchema],
  // optional: if you want per-question weight
  marks: {
    type: Number,
    default: 1
  },
  // optional explanation for review
  explanation: String
}, {
  timestamps: true
});

export default mongoose.model('Question', questionSchema);
