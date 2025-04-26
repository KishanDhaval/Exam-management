import express from "express";
import {
  getResultsByExam,
  getResultsForStudent,
  submitResult,
} from "../controllers/resultController.js";
import { requireSignin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Result routes
router.post("/results",requireSignin, submitResult);
router.get("/results/student/:studentId", requireSignin,getResultsForStudent);
router.get("/results/exam/:examId",requireSignin ,getResultsByExam);

export default router;