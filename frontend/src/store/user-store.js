import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const useUserStore = create(
  persist(
    (set) => ({
      user: null, // { id, name, email, ... }
      isLoggedIn: false,
      token: null,
      login: (userData, tokenData) => set({ user: userData, isLoggedIn: true, token: tokenData }),
      logout: () => set({ user: null, isLoggedIn: false, token: null }),
    }),
    {
      name: 'user-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
)