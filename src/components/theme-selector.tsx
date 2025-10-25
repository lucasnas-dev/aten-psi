"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeSelector() {
  const { mode, toggleMode } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMode}
      className="group hover:bg-primary/10 hover:text-primary relative transition-all"
    >
      {mode === "dark" ? (
        <Moon className="h-4 w-4 transition-transform group-hover:rotate-12" />
      ) : (
        <Sun className="h-4 w-4 transition-transform group-hover:rotate-12" />
      )}
      <span className="sr-only">
        Alternar modo {mode === "dark" ? "claro" : "escuro"}
      </span>
    </Button>
  );
}
