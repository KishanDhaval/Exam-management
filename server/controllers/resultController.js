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
    const studentId = req.user._id;

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

export const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const now = new Date();

    // 1) Load all exams for this teacher
    const exams = await Exam.find({ createdBy: teacherId });
    const examIds = exams.map((e) => e._id);

    // 2) Compute totals & stats
    const totalExams = exams.length;
    const activeExams = exams.filter(
      (e) => e.startDate <= now && e.endDate >= now
    ).length;

    // 3) Distinct students across all exams
    const students = await Result.distinct("student", {
      exam: { $in: examIds },
    });
    const totalStudents = students.length;

    // 4) Overall average score
    const overallAgg = await Result.aggregate([
      { $match: { exam: { $in: examIds } } },
      { $group: { _id: null, avgScore: { $avg: "$score" } } },
    ]);
    const averageScore = overallAgg.length
      ? Math.round(overallAgg[0].avgScore)
      : 0;

    // 5) Recent exams (last 5) + per‐exam stats + full studentResults
    const recentRaw = await Exam.find({ createdBy: teacherId })
      .sort({ startDate: -1 })
      .limit(5)
      .select("title startDate endDate");

    const recentExams = await Promise.all(
      recentRaw.map(async (exam) => {
        // a) submissions & avgScore
        const stats = await Result.aggregate([
          { $match: { exam: exam._id } },
          {
            $group: {
              _id: null,
              submissions: { $sum: 1 },
              avgScore: { $avg: "$score" },
            },
          },
        ]);

        // b) full list of results for this exam
        const studentResults = await Result.find({ exam: exam._id })
          .populate("student", "name email")
          .select("student score submittedAt timeSpent")
          .sort({ submittedAt: -1 });

        return {
          id: exam._id,
          title: exam.title,
          submissions: stats.length ? stats[0].submissions : 0,
          averageScore: stats.length ? Math.round(stats[0].avgScore) : 0,
          studentResults, // ← here’s your exam.studentResult array
        };
      })
    );

    return res.json({
      examStats: { totalExams, activeExams, totalStudents, averageScore },
      recentExams,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
