import express from 'express';
import { isTeacher, requireSignin } from '../middlewares/authMiddleware.js'; // Add .js extension
import { createExam, getExamById, getAllExams, updateExam, deleteExam } from '../controllers/examController.js';

const router = express.Router();

// Exam routes
router.post('/exams', requireSignin, isTeacher, createExam);
router.get('/exams', requireSignin, getAllExams);
router.get('/exams/:id', requireSignin, getExamById);
router.put('/exams/:id', requireSignin, isTeacher, updateExam);
router.delete('/exams/:id', requireSignin, isTeacher, deleteExam);

export default router;