"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleMode}
      className="h-8 w-8 p-0"
      title={
        mode === "light"
          ? "Alternar para modo escuro"
          : "Alternar para modo claro"
      }
    >
      <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Alternar modo de cor</span>
    </Button>
  );
}
