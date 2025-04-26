import React from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

function ResultDetailsModal({ result, exam, onClose }) {
  if (!result || !exam) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">{exam.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
            <span>Score: {result.score}%</span>
            <span>•</span>
            <span>Time Spent: {result.timeSpent} minutes</span>
            <span>•</span>
            <span>Submitted: {new Date(result.submittedAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-8">
            {result.answers.map((answer, index) => {
              const question = answer.question;
              const selectedOption = answer?.selectedOption;
              const correctOption = question?.options.find(opt => opt.isCorrect);
              const isCorrect = selectedOption === correctOption?._id;
                console.log('====================================');
                console.log(question);
                console.log('====================================');
              return (
                <div key={answer._id} className="border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          Question {index + 1}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({question?.marks} marks)
                        </span>
                      </div>
                      <p className="mt-2 text-lg font-medium">{question?.questionText}</p>

                      <div className="mt-4 space-y-2">
                        {question?.options.map((option) => (
                          <div
                            key={option._id}
                            className={`p-3 rounded-lg border ${
                              option.isCorrect
                                ? 'border-green-200 bg-green-50'
                                : option._id === selectedOption?._id
                                ? 'border-red-200 bg-red-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="flex-1">{option.text}</span>
                              {option.isCorrect && (
                                <span className="text-green-600 text-sm">Correct Answer</span>
                              )}
                              {option._id === selectedOption && !option.isCorrect && (
                                <span className="text-red-600 text-sm">Your Answer</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {question?.explanation && (
                        <div className="mt-4 text-sm text-gray-600">
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultDetailsModal;