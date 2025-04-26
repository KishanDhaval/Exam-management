import express from "express";
import {
  addQuestion,
  deleteQuestion,
  getQuestionsByExam,
  updateQuestion,
} from "../controllers/questionController.js";
import { isTeacher, requireSignin } from "../middlewares/authMiddleware.js";

const router = express.Router();



// Question routes
router.post("/questions",requireSignin , isTeacher ,  addQuestion);
router.get("/questions/exam/:examId",requireSignin , getQuestionsByExam);
router.put("/questions/:id",requireSignin , isTeacher, updateQuestion);
router.delete("/questions/:id",requireSignin , isTeacher ,deleteQuestion);

export default router;
