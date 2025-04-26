// controllers/examController.js
import Exam from "../models/Exam.js";
import Question from "../models/Question.js";

export const createExam = async (req, res) => {
  try {
    const { title, description, startDate, endDate, duration, questions } =
      req.body;
    // 1) create the exam shell
    const exam = new Exam({
      title,
      description,
      startDate,
      endDate,
      duration,
      createdBy: req.user._id,
    });
    await exam.save();

    // 2) if questions provided, bulk insert them
    if (questions.length) {
      // map your payload to Question docs
      const toInsert = questions.map((q) => ({
        exam: exam._id,
        questionText: q.questionText,
        options: q.options,
        marks: q.marks,
        explanation: q.explanation,
      }));
      const created = await Question.insertMany(toInsert);

      // 3) link them back to exam
      exam.questions = created.map((q) => q._id);
      await exam.save();
    }

    // 4) return the full exam with questions populated
    const populated = await Exam.findById(exam._id)
      .populate("questions")
      .populate("createdBy", "name email");

    res.status(201).json(populated);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("createdBy", "name email")
      .populate("questions")
      .sort({ startDate: 1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("questions")
      .populate("createdBy", "name email");
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // only creator or admin can update
    if (
      exam.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this exam" });
    }

    Object.assign(exam, req.body);
    const updated = await exam.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    if (
      exam.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this exam" });
    }

    await exam.remove();
    res.json({ message: "Exam removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
