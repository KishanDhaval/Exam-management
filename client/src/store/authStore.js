import { create } from 'zustand';

const mockLogin = async (email, password, role) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email && password) {
    return {
      id: '1',
      name: role === 'student' ? 'John Doe' : 'Prof. Sarah Smith',
      email,
      role,
    };
  }
  throw new Error('Invalid credentials');
};

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password, role) => {
    try {
      const user = await mockLogin(email, password, role);
      set({ user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));