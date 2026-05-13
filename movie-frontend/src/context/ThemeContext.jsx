import React, { createContext, useState, useContext, useEffect } from "react";

// 🎨 Create Theme Context
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 🌙 Default theme is dark
  const [isDark, setIsDark] = useState(true);

  // 💾 Remember theme even after page refresh
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    }
  }, []);

  // 🔄 Toggle between dark and light
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    // save to localStorage so it remembers
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // 🎨 These are the colors for dark and light mode
  // Every component will use these instead of hardcoding colors
  const theme = {
    // backgrounds
    bg:        isDark ? "#0f1117" : "#f3f4f6",
    bgCard:    isDark ? "#1f2937" : "#ffffff",
    bgNav:     isDark ? "#111827" : "#ffffff",
    bgInput:   isDark ? "#374151" : "#f9fafb",

    // text
    textMain:  isDark ? "#ffffff" : "#111827",
    textSub:   isDark ? "#9ca3af" : "#6b7280",

    // border
    border:    isDark ? "#374151" : "#e5e7eb",

    // accent (always red)
    accent:    "#dc2626",
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 🪝 Custom hook — use this in any component
// Usage: const { isDark, toggleTheme, theme } = useTheme();
export function useTheme() {
  return useContext(ThemeContext);
}