"use client";

import { Bell, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      {/* Mobile menu button - pode ser usado futuramente */}
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-500">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Right side buttons */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notificações</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Configurações</span>
        </Button>
      </div>
    </header>
  );
}
