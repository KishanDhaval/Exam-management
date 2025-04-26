import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';
import { useExamContext } from '../hooks/useExamContext';

function CreateExam() {
  const {setExams} = useExamContext()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    duration: 60,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    marks: 1,
    explanation: ''
  });

  const handleExamSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {        
      const {data} = await axiosInstance.post('/exam/create' , examData);
      setExams(prevExams => [...prevExams, data]);
      navigate('/dashboard/teacher');
    } catch (error) {
      console.error('Failed to create exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    if (currentQuestion.questionText.trim() === '') return;
    
    setExamData(prev => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion }]
    }));

    setCurrentQuestion({
      questionText: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      marks: 1,
      explanation: ''
    });
  };

  const removeQuestion = (index) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const updateOption = (optionIndex, field, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === optionIndex 
          ? { ...option, [field]: field === 'isCorrect' ? value : value }
          : field === 'isCorrect' ? { ...option, isCorrect: false } : option
      )
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/dashboard/teacher')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6">Create New Exam</h1>
          
          <form onSubmit={handleExamSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                value={examData.title}
                onChange={(e) => setExamData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none px-2 py-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={examData.description}
                onChange={(e) => setExamData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none px-2 py-1"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="datetime-local"
                  required
                  value={examData.startDate}
                  onChange={(e) => setExamData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none px-2 py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="datetime-local"
                  required
                  value={examData.endDate}
                  onChange={(e) => setExamData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none px-2 py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={examData.duration}
                  onChange={(e) => setExamData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none px-2 py-1"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Add Questions</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Question Text</label>
              <textarea
                value={currentQuestion.questionText}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none px-2 py-1"
                rows="2"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Options</label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={option.isCorrect}
                    onChange={() => updateOption(index, 'isCorrect', true)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(index, 'text', e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:outline-none px-2 py-1"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Marks</label>
                <input
                  type="number"
                  min="1"
                  value={currentQuestion.marks}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, marks: parseInt(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none px-2 py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Explanation (Optional)</label>
                <input
                  type="text"
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none px-2 py-1"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Question
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Added Questions ({examData.questions.length})</h2>
          
          <div className="space-y-4">
            {examData.questions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{question.questionText}</p>
                    <div className="mt-2 space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <span className={option.isCorrect ? 'text-green-600 font-medium' : ''}>
                            {option.text}
                          </span>
                          {option.isCorrect && <span className="text-xs text-green-600">(Correct)</span>}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Marks: {question.marks}
                      {question.explanation && ` • Explanation: ${question.explanation}`}
                    </div>
                  </div>
                  <button
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleExamSubmit}
            disabled={loading || examData.questions.length === 0}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Creating Exam...' : 'Create Exam'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateExam;