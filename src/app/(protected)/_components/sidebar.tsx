"use client";

import {
  BarChart3,
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Painel", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pacientes", href: "/pacientes", icon: Users },
  { name: "Agenda", href: "/agenda", icon: Calendar },
  { name: "Prontuários", href: "/prontuarios", icon: FileText },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Adicionar lógica de logout aqui
    console.log("Logout");
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      {/* Header */}
      <div className="flex h-16 items-center justify-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-bold">
            A
          </div>
          <div className="text-xl font-semibold">Aten PSI</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    pathname === item.href ||
                      pathname.startsWith(`${item.href}/`)
                      ? "text-primary-foreground"
                      : "text-gray-400 group-hover:text-gray-500",
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer with user info */}
      <div className="border-t p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Dr. Lucas</span>
              <span className="text-muted-foreground text-xs">
                lucas@exemplo.com
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}
