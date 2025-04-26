import { create } from 'zustand';

const mockExams = [
  {
    id: '1',
    title: 'Mathematics Final Exam',
    description: 'Comprehensive exam covering calculus and algebra',
    duration: 120,
    startDate: '2024-03-25T10:00:00Z',
    endDate: '2024-03-25T12:00:00Z',
    totalMarks: 100,
    questions: [
      {
        id: '1',
        type: 'mcq',
        text: 'What is the derivative of x²?',
        options: ['x', '2x', '2x²', 'x½'],
        correctAnswer: '2x',
        marks: 5
      },
      {
        id: '2',
        type: 'true-false',
        text: 'The sum of interior angles of a triangle is 180 degrees.',
        correctAnswer: true,
        marks: 2
      }
    ],
    createdBy: 'teacher1',
    subject: 'Mathematics'
  },
  {
    id: '2',
    title: 'Physics Mid-term',
    description: 'Covers mechanics and thermodynamics',
    duration: 90,
    startDate: '2024-03-28T14:00:00Z',
    endDate: '2024-03-28T15:30:00Z',
    totalMarks: 50,
    questions: [
      {
        id: '1',
        type: 'short-answer',
        text: 'Explain Newton\'s First Law of Motion.',
        marks: 10
      }
    ],
    createdBy: 'teacher2',
    subject: 'Physics'
  }
];

const mockResults = [
  {
    id: '1',
    examId: '1',
    studentId: '1',
    score: 85,
    totalMarks: 100,
    submittedAt: '2024-03-15T10:45:00Z',
    timeSpent: 45,
    answers: {
      '1': '2x',
      '2': true
    }
  },
  {
    id: '2',
    examId: '2',
    studentId: '1',
    score: 92,
    totalMarks: 100,
    submittedAt: '2024-03-10T15:00:00Z',
    timeSpent: 60,
    answers: {
      '1': 'An object remains at rest or in uniform motion unless acted upon by an external force.'
    }
  }
];

export const useExamStore = create((set) => ({
  exams: [],
  results: [],
  loading: false,
  error: null,

  createExam: async (exam) => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newExam = { ...exam, id: Math.random().toString() };
      set(state => ({
        exams: [...state.exams, newExam],
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to create exam', loading: false });
    }
  },

  submitExam: async (result) => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newResult = { ...result, id: Math.random().toString() };
      set(state => ({
        results: [...state.results, newResult],
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to submit exam', loading: false });
    }
  },

  fetchExams: async () => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ exams: mockExams, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch exams', loading: false });
    }
  },

  fetchResults: async (studentId) => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const studentResults = mockResults.filter(r => r.studentId === studentId);
      set({ results: studentResults, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch results', loading: false });
    }
  }
}));