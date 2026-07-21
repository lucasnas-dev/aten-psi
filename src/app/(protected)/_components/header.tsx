"use client";

import { Bell, Settings } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-card flex h-14 items-center justify-between px-4 sm:px-6">
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

      {/* Right side intentionally empty — buttons moved to Sidebar */}
      <div />
    </header>
  );
}
