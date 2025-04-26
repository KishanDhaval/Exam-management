// controllers/questionController.js
import Question from '../models/Question.js';
import Exam from '../models/Exam.js';

export const addQuestion = async (req, res) => {
  try {
    const { examId, questionText, options, marks, explanation } = req.body;
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // only creator or admin can add
    if (exam.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify this exam' });
    }

    const question = await Question.create({
      exam: examId,
      questionText,
      options,
      marks,
      explanation
    });

    // push into exam.questions
    exam.questions.push(question._id);
    await exam.save();

    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getQuestionsByExam = async (req, res) => {
  try {
    const questions = await Question.find({ exam: req.params.examId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('exam');
    if (!question) return res.status(404).json({ message: 'Question not found' });

    // only exam owner or admin
    if (question.exam.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this question' });
    }

    Object.assign(question, req.body);
    const updated = await question.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('exam');
    if (!question) return res.status(404).json({ message: 'Question not found' });

    if (question.exam.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }

    await question.remove();
    // also remove from exam.questions
    await Exam.findByIdAndUpdate(question.exam._id, {
      $pull: { questions: question._id }
    });

    res.json({ message: 'Question removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
