"use client";

import { Bell, Settings } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-card border-border/50 flex h-14 items-center justify-between border-b px-6 shadow-sm">
      {/* Left side with date */}
      <div className="flex items-center">
        <span className="text-foreground text-sm font-medium">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </span>
      </div>

      {/* Right side buttons */}
      <div className="flex items-center gap-1">
        <ModeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent hover:text-accent-foreground h-8 w-8"
        >
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notificações</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-accent hover:text-accent-foreground h-8 w-8"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Configurações</span>
        </Button>
      </div>
    </header>
  );
}
