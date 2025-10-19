"use client";

import { ReactNode, useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";


export function ThemeProvider({ children }) {
  const { theme, setTheme } = useThemeStore();

  // Load theme from localStorage only once on mount
  useEffect(() => {
    const prefer = localStorage.getItem("theme");
    if (prefer) {
      setTheme(prefer);
    }
  }, [setTheme]);

  // Apply theme to <html> and update localStorage when theme changes
  useEffect(() => {
    if (!theme) return;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return <>{children}</>;
}
