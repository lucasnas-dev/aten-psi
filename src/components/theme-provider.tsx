"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "default" | "nature" | "creative" | "elegant" | "ocean";
type Mode = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultMode?: Mode;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  mode: Mode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
};

const initialState: ThemeProviderState = {
  theme: "default",
  mode: "light",
  setTheme: () => null,
  setMode: () => null,
  toggleMode: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "default",
  storageKey = "aten-psi-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mode, setMode] = useState<Mode>("light"); // Sempre inicializa em light

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove todos os temas e modos anteriores
    root.removeAttribute("data-theme");
    root.classList.remove("light", "dark");

    // Aplica o novo tema (se não for o default)
    if (theme !== "default") {
      root.setAttribute("data-theme", theme);
    }

    // Aplica o modo (light/dark)
    root.classList.add(mode);

    // Debug: verificar se está aplicando
    console.log("🎨 Tema aplicado:", theme);
    console.log("� Modo aplicado:", mode);
    console.log("�🏠 data-theme:", root.getAttribute("data-theme"));
    console.log("📝 classes:", root.className);

    // Salva no localStorage
    localStorage.setItem(storageKey, theme);
    localStorage.setItem(`${storageKey}-mode`, mode);
  }, [theme, mode, storageKey]);

  useEffect(() => {
    // Carrega apenas o tema do localStorage na inicialização
    const storedTheme = localStorage.getItem(storageKey) as Theme;

    if (storedTheme) {
      setTheme(storedTheme);
    }

    // Sempre força o modo light, não carrega do localStorage
    setMode("light");
  }, [storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
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

// Constantes para uso em outros componentes
export const themes = [
  {
    name: "Padrão",
    value: "default" as const,
    description: "Neutro clássico - preto, branco e cinza",
    color: "oklch(0.2 0 0)",
  },
  {
    name: "Natureza",
    value: "nature" as const,
    description: "Verde natural - equilíbrio e crescimento",
    color: "oklch(0.65 0.25 140)",
  },
  {
    name: "Criativo",
    value: "creative" as const,
    description: "Roxo vibrante - criatividade e introspecção",
    color: "oklch(0.6 0.3 300)",
  },
  {
    name: "Elegante",
    value: "elegant" as const,
    description: "Neutro sofisticado - profissionalismo",
    color: "oklch(0.45 0.1 260)",
  },
  {
    name: "Oceano",
    value: "ocean" as const,
    description: "Azul calmo - confiança e serenidade",
    color: "oklch(0.6 0.2 220)",
  },
] as const;
