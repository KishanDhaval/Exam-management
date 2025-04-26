// controllers/resultController.js
import Result from "../models/Result.js";
import Exam from "../models/Exam.js";
import Question from "../models/Question.js";

export const submitResult = async (req, res) => {
  try {
    const { examId, answers, timeSpent } = req.body;
    const exam = await Exam.findById(examId).populate("questions");
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    // ensure within window
    const now = new Date();
    if (now < exam.startDate || now > exam.endDate) {
      return res.status(400).json({ message: "Exam not active" });
    }

    // calculate score
    let correct = 0;
    for (let ans of answers) {
      const q = await Question.findById(ans.question);
      const chosen = q.options.id(ans.selectedOption);
      if (chosen && chosen.isCorrect) correct += q.marks;
    }
    const totalMarks = exam.questions.reduce(
      (sum, q) => sum + (q.marks || 1),
      0
    );
    const scorePct = Math.round((correct / totalMarks) * 100);

    const result = await Result.create({
      student: req.user._id,
      exam: examId,
      answers,
      timeSpent,
      score: scorePct,
    });

    exam.participants.push(req.user._id);
    await exam.save();

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getResultsForStudent = async (req, res) => {
  try {
    const studentId = req.user._id
   
    const results = await Result.find({ student: studentId })
      // already populating exam info
      .populate("exam", "title startDate endDate")
      // populate the full question document for each answer
      .populate({
        path: "answers.question",
        select: "questionText options marks explanation",
        model: "Question",
      })
      .sort({ submittedAt: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getResultsByExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // only creator or admin
    if (
      exam.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const results = await Result.find({ exam: examId })
      .populate("student", "name email")
      .sort({ submittedAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
