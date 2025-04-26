import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, ArrowLeft, Send } from "lucide-react";
import { useExamStore } from "../store/examStore";
import { useExamContext } from "../hooks/useExamContext";
import axiosInstance from "../utils/axiosConfig";

function TakeExam() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const { exams ,setFetch} = useExamContext();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentExam = exams.find((e) => e._id === examId);
    if (!currentExam) {
      navigate("/dashboard/student");
      return;
    }
    setExam(currentExam);
    setTimeLeft(currentExam.duration * 60); // Convert minutes to seconds
  }, [examId, exams, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const result = {
        examId: exam?._id,
        answers: Object.entries(answers).map(
          ([questionId, selectedOption]) => ({
            question: questionId,
            selectedOption,
          })
        ),
        timeSpent: exam.duration - Math.floor(timeLeft / 60),
      };

      await axiosInstance.post("/result/submit" , result);
      setFetch(true)
      navigate("/dashboard/student");
    } catch (error) {
      console.error("Failed to submit exam:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!exam) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/dashboard/student")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Exit Exam
          </button>
          <div className="flex items-center text-lg font-semibold">
            <Clock className="w-5 h-5 mr-2 text-indigo-600" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">{exam.title}</h1>
          <p className="text-gray-600 mb-6">{exam.description}</p>

          <div className="space-y-8">
            {exam.questions.map((question, index) => (
              <div key={question._id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                    Q{index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-lg font-medium mb-4">
                      {question.questionText}
                    </p>
                    <div className="space-y-3">
                      {question.options.map((option) => (
                        <label
                          key={option._id}
                          className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name={`question-${question._id}`}
                            checked={answers[question._id] === option._id}
                            onChange={() =>
                              handleAnswerSelect(question._id, option._id)
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>{option.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={
              loading || Object.keys(answers).length !== exam.questions.length
            }
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            <Send className="w-5 h-5 mr-2" />
            {loading ? "Submitting..." : "Submit Exam"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TakeExam;
