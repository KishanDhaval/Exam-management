import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  BookOpen,
  Users,
  Settings,
  BarChart2,
  Library,
} from "lucide-react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useExamContext } from "../hooks/useExamContext";
import LogoutBtn from "../Components/LogoutBtn";
import TeacherResultsModal from "../Components/TeacherResultsModel";

function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { exams, teacherResults } = useExamContext();
  const [selectedExamId, setSelectedExamId] = useState(null);

  const examStats = teacherResults?.examStats;
  const recentExams = teacherResults?.recentExams;

  const handleViewResults = (examId) => {
    setSelectedExamId(examId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">{user?.name}</h1>
          <div className="flex sm:space-x-4 space-x-2 items-center">
            <button
              onClick={() => navigate("/exams/create")}
              className="flex items-center px-4 sm:py-1 py-2 bg-blue-50 text-blue-900 rounded-md hover:bg-blue-100 transition"
            >
              <PlusCircle className="w-5 h-5 sm:mr-2" />
              <p className="hidden sm:block">Create New Exam</p>
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <Settings className="w-5 h-5 mr-2" />
              <p className="hidden sm:block">Profile Settings</p>
            </button>
            <LogoutBtn />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Exams
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {exams?.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Library className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Exams
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {examStats?.activeExams}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Students
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {examStats?.totalStudents}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart2 className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Average Score
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {examStats?.averageScore}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Exams
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentExams?.map((exam) => (
              <div key={exam.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {exam.title}
                    </h4>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>{exam.submissions} submissions</span>
                      <span className="mx-2">•</span>
                      <span>Average score: {exam.averageScore}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewResults(exam.id)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    View Results
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedExamId && (
        <TeacherResultsModal
          examId={selectedExamId}
          results={recentExams}
          onClose={() => setSelectedExamId(null)}
        />
      )}
    </div>
  );
}

export default TeacherDashboard;