import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  History,
  Settings,
  Award,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useExamContext } from "../hooks/useExamContext";
import ResultDetailsModal from "../Components/ResultDetailsModel";
import LogoutBtn from "../Components/LogoutBtn";

function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { exams ,results} = useExamContext();
  const [selectedResult, setSelectedResult] = useState(null);
  
  const getExamStatus = (exam) => {
    const now = new Date();
    const startDate = new Date(exam.startDate);
    const endDate = new Date(exam.endDate);

    if (now < startDate) {
      const timeToStart = startDate - now;
      const days = Math.floor(timeToStart / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeToStart % (1000 * 60 * 60)) / (1000 * 60));
      
      return {
        status: 'upcoming',
        message: `Starts in ${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m`,
        color: 'text-yellow-600'
      };
    }

    if (now > endDate) {
      return {
        status: 'ended',
        message: 'Exam ended',
        color: 'text-red-600'
      };
    }

    const timeLeft = endDate - now;
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return {
      status: 'live',
      message: `${hours}h ${minutes}m remaining`,
      color: 'text-green-600'
    };
  };

  const sortedExams = [...exams].sort((a, b) => {
    const aStart = new Date(a.startDate);
    const bStart = new Date(b.startDate);
    return aStart - bStart;
  });


  const handleStartExam = (examId) => {
    navigate(`/exams/take/${examId}`);
  };

  const handleViewResult = (result) => {
    const exam = exams.find((e) => e._id === result.exam._id);
    setSelectedResult({ ...result, exam });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">{user?.name}</h1>
          <div className="flex gap-2">
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <Settings className="w-5 h-5 mr-2" />
              <p className="hidden sm:block">Profile Settings</p>
            </button>
          <LogoutBtn />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Exams</h2>
              </div>
              <div className="space-y-4">
                {sortedExams.map((exam) => {
                  const examStatus = getExamStatus(exam);
                  
                  return (
                    <div key={exam._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {exam.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {exam.description}
                          </p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {exam.duration} minutes
                          </div>
                          <div className="mt-2 flex items-center text-sm">
                            <AlertCircle className={`w-4 h-4 mr-1 ${examStatus.color}`} />
                            <span className={examStatus.color}>
                              {examStatus.message}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleStartExam(exam._id)}
                          className={`px-4 py-2 rounded-md ${
                            examStatus.status === 'live' && !exam.participants?.includes(user._id)
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={examStatus.status !== 'live' || exam.participants?.includes(user._id)}
                        >
                          {exam.participants?.includes(user._id)
                            ? 'Already Participated'
                            : examStatus.status === 'live'
                            ? 'Start Exam'
                            : 'Not Available'}
                        </button>
                      </div>
                    </div>
                  );
                })}
                {sortedExams.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No exams available
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <History className="w-6 h-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Past Results
                </h2>
              </div>
              <div className="space-y-4">
                {results.map((result) => {
                  const exam = exams.find((e) => e._id === result?.exam?._id);
                  return (
                    <div key={result._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {exam?.title}
                          </h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <Award className="w-4 h-4 mr-1" />
                            Score: {result.score}%
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            Completed on{" "}
                            {new Date(result.submittedAt).toLocaleDateString()}{" "}
                            • Time spent: {result.timeSpent} minutes
                          </div>
                        </div>
                        <button 
                          onClick={() => handleViewResult(result)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
                {results.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No exam results yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedResult && (
        <ResultDetailsModal
          result={selectedResult}
          exam={selectedResult.exam}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  );
}

export default StudentDashboard;