"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Mode = "light" | "dark";
export type FontScale = "compact" | "default" | "large";

const DEFAULT_FONT_SCALE: FontScale = "default";

const FONT_SCALE_STORAGE_KEY = "aten-psi-font-scale";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultMode?: Mode;
  storageKey?: string;
};

type ThemeProviderState = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultMode = "light",
  storageKey = "aten-psi-theme",
  ...props
}: ThemeProviderProps) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [fontScale, setFontScale] = useState<FontScale>(DEFAULT_FONT_SCALE);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedMode = localStorage.getItem(storageKey);
      const storedScale = localStorage.getItem(FONT_SCALE_STORAGE_KEY);

      if (storedMode === "light" || storedMode === "dark") {
        setMode(storedMode);
      }
      if (
        storedScale === "compact" ||
        storedScale === "default" ||
        storedScale === "large"
      ) {
        setFontScale(storedScale);
      }
    } catch {
      // As preferências continuam disponíveis quando o armazenamento é bloqueado.
    }
    setPreferencesLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!preferencesLoaded) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    root.dataset.fontScale = fontScale;

    try {
      localStorage.setItem(storageKey, mode);
      localStorage.setItem(FONT_SCALE_STORAGE_KEY, fontScale);
    } catch {
      // Não impedir a alteração visual se o navegador não permitir persistência.
    }
  }, [mode, fontScale, storageKey, preferencesLoaded]);

  const value = {
    mode,
    setMode: (mode: Mode) => {
      setMode(mode);
    },
    toggleMode: () => {
      setMode((current) => (current === "light" ? "dark" : "light"));
    },
    fontScale,
    setFontScale,
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
