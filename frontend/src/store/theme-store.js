import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: 'dark', // default theme
  setTheme: (theme) => set({ theme }),
}));