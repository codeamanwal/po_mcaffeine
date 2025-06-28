import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  isDarkMode: 'light', // default theme
  setIsDarkMode: (isDarkMode) => set({ isDarkMode }),
}));