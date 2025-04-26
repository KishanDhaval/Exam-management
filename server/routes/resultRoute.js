import express from "express";
import {
  getResultsByExam,
  getResultsForStudent,
  getTeacherDashboard,
  submitResult,
} from "../controllers/resultController.js";
import { isTeacher, requireSignin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Result routes
router.post("/submit",requireSignin, submitResult);
router.get("/student", requireSignin,getResultsForStudent);
router.get("/exam/:examId",requireSignin ,getResultsByExam);
router.get("/teacher/",requireSignin , isTeacher ,getTeacherDashboard);

export default router;