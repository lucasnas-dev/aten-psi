"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Mode = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultMode?: Mode;
  storageKey?: string;
};

type ThemeProviderState = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
};

const initialState: ThemeProviderState = {
  mode: "light",
  setMode: () => null,
  toggleMode: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultMode = "light",
  storageKey = "aten-psi-theme",
  ...props
}: ThemeProviderProps) {
  const [mode, setMode] = useState<Mode>(defaultMode);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    localStorage.setItem(storageKey, mode);
  }, [mode, storageKey]);

  useEffect(() => {
    const storedMode = localStorage.getItem(storageKey) as Mode;
    if (storedMode) {
      setMode(storedMode);
    }
  }, [storageKey]);

  const value = {
    mode,
    setMode: (mode: Mode) => {
      setMode(mode);
    },
    toggleMode: () => {
      setMode(mode === "light" ? "dark" : "light");
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
