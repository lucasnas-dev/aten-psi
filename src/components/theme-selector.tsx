"use client";

import { Palette } from "lucide-react";

import { themes, useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const currentTheme = themes.find((t) => t.value === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group hover:bg-primary/10 hover:text-primary relative transition-all duration-300 hover:scale-105"
        >
          <Palette className="h-4 w-4 transition-transform group-hover:rotate-12" />
          {/* Indicador visual do tema atual */}
          <div
            className="border-background absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 shadow-sm"
            style={{ backgroundColor: currentTheme?.color }}
          />
          <span className="sr-only">Alterar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-card/95 border-border/50 w-64 shadow-lg backdrop-blur-sm"
      >
        <DropdownMenuLabel className="text-center font-semibold">
          🎨 Escolher Tema
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => {
              console.log("🎨 Mudando tema para:", themeOption.value);
              setTheme(themeOption.value);
            }}
            className="hover:from-primary/10 hover:to-secondary/10 mx-1 my-1 flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] hover:bg-gradient-to-r hover:shadow-sm"
          >
            <div className="relative">
              <div
                className="border-border h-6 w-6 flex-shrink-0 rounded-full border-2 shadow-md transition-transform hover:scale-110"
                style={{ backgroundColor: themeOption.color }}
              />
              {theme === themeOption.value && (
                <div className="border-background absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 bg-green-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-foreground font-semibold">
                  {themeOption.name}
                </span>
                {theme === themeOption.value && (
                  <span className="from-primary to-secondary text-primary-foreground rounded-full bg-gradient-to-r px-2 py-0.5 text-xs font-medium shadow-sm">
                    ✓ Ativo
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {themeOption.description}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="p-2 text-center">
          <p className="text-muted-foreground text-xs">
            Tema atual:{" "}
            <span className="text-primary font-medium">
              {currentTheme?.name}
            </span>
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
