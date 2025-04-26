// models/Exam.js
import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    // when students can start attempting
    startDate: {
      type: Date,
      required: true,
    },
    // when submissions close
    endDate: {
      type: Date,
      required: true,
    },
    // in minutes
    duration: {
      type: Number,
      required: true,
    },
    // which teacher created this exam
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // questions are stored separately in Question model
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Exam", examSchema);
