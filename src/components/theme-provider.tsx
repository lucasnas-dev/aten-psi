"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "default" | "nature" | "creative" | "elegant" | "ocean";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "default",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "default",
  storageKey = "aten-psi-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove todos os temas anteriores
    root.removeAttribute("data-theme");

    // Aplica o novo tema (se não for o default)
    if (theme !== "default") {
      root.setAttribute("data-theme", theme);
    }

    // Debug: verificar se está aplicando
    console.log("🎨 Tema aplicado:", theme);
    console.log("🏠 data-theme:", root.getAttribute("data-theme"));

    // Salva no localStorage
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  useEffect(() => {
    // Carrega o tema do localStorage na inicialização
    const storedTheme = localStorage.getItem(storageKey) as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
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
    description: "Roxo moderno - criatividade e inovação",
    color: "oklch(0.65 0.25 280)",
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
