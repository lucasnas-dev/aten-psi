"use client";

import { Bell, Settings } from "lucide-react";

import { ThemeSelector } from "@/components/theme-selector";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-header-background border-border/50 flex h-16 items-center justify-between border-b px-4 shadow-sm backdrop-blur-sm md:px-6">
      {/* Left side with date and breadcrumb area */}
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <span className="text-header-foreground text-sm font-medium">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
          <span className="text-muted-foreground text-xs">
            Sistema de Atendimento Psicológico
          </span>
        </div>
      </div>

      {/* Right side buttons with enhanced styling */}
      <div className="flex items-center gap-2">
        <div className="from-primary/5 to-secondary/5 border-border/50 flex items-center gap-1 rounded-lg border bg-gradient-to-r p-1 shadow-sm backdrop-blur-sm">
          <ThemeSelector />
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notificações</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Configurações</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
