import React from "react";
import { X, Award, Clock, User } from "lucide-react";

function TeacherResultsModal({ examId, results, onClose }) {
  const exam = results.find((r) => r.id === examId);
  if (!exam) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">{exam.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <User className="w-5 h-5" />
                <span className="sm:font-medium font-light hidden sm:block">
                  Total Submissions
                </span>
              </div>
              <p className="mt-2 sm:text-2xl text-xl font-bold text-blue-900">
                {exam.submissions}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Award className="w-5 h-5" />
                <span className="sm:font-medium font-light hidden sm:block">
                  Average Score
                </span>
              </div>
              <p className="mt-2 sm:text-2xl text-xl font-bold text-green-900">
                {exam.averageScore}%
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-purple-700">
                <Clock className="w-5 h-5" />
                <span className="sm:font-medium font-light hidden sm:block">
                  Status
                </span>
              </div>
              <p className="mt-2 sm:text-lg text-sm font-semibold text-purple-900">
                {new Date() > new Date(exam.endDate)
                  ? "Completed"
                  : "In Progress"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          <h3 className="text-lg font-semibold mb-4">Student Results</h3>
          <div className="space-y-4">
            {exam.studentResults?.map((result) => (
              <div key={result.studentId} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {result.studentName}
                    </h4>
                    <div className="mt-1 sm:text-sm text-xs  text-gray-500">
                      Submitted: {new Date(result.submittedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="sm:text-2xl text-xl font-bold text-gray-900">
                      {result.score}%
                    </div>
                    <div className="sm:text-sm text-xs text-gray-500">
                      Time: {result.timeSpent} min
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherResultsModal;
