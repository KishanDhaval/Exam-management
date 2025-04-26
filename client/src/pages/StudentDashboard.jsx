import React, { useEffect } from "react";
import { useExamStore } from "../store/examStore";
import {
  BookOpen,
  Clock,
  History,
  Settings,
  Award,
  Loader2,
} from "lucide-react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

function StudentDashboard() {
  const { user } = useAuthContext();
  const { exams, results, loading, fetchExams, fetchResults } = useExamStore();
  const {logout} = useLogout()

  useEffect(() => {
    fetchExams();
    if (user?.id) {
      fetchResults(user.id);
    }
  }, [fetchExams, fetchResults, user?.id]);

  const availableExams = exams.filter((exam) => {
    const now = new Date();
    const startDate = new Date(exam.startDate);
    const endDate = new Date(exam.endDate);
    return now >= startDate && now <= endDate;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const handleLogout = async()=>{
    try {
      await logout()
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {" "}
              {user?.name}
            </h1>
          <div className="flex gap-2">
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <Settings className="w-5 h-5 mr-2" />
              <p className="hidden sm:block">Profile Settings</p>
            </button>
            <button onClick={handleLogout}>
              logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Available Exams
                </h2>
              </div>
              <div className="space-y-4">
                {availableExams.map((exam) => (
                  <div key={exam.id} className="border rounded-lg p-4">
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
                        <div className="mt-1 text-sm text-gray-500">
                          Due: {new Date(exam.endDate).toLocaleString()}
                        </div>
                      </div>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                        Start Exam
                      </button>
                    </div>
                  </div>
                ))}
                {availableExams.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No exams currently available
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
                  const exam = exams.find((e) => e.id === result.examId);
                  return (
                    <div key={result.id} className="border rounded-lg p-4">
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
                        <button className="text-indigo-600 hover:text-indigo-800">
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
    </div>
  );
}

export default StudentDashboard;
