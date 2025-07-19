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
  { name: "Pacientes", href: "/patients", icon: Users },
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
    <div className="bg-sidebar flex h-full w-64 flex-col border-r shadow-lg">
      {/* Header */}
      <div className="border-sidebar-border/50 from-primary/5 via-sidebar to-secondary/5 flex h-16 items-center justify-center border-b bg-gradient-to-r px-4">
        <div className="flex items-center gap-3">
          <div className="from-primary to-secondary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-lg font-bold shadow-md transition-transform hover:scale-105">
            A
          </div>
          <div className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
            Aten PSI
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="custom-scrollbar flex-1 overflow-y-auto py-6">
        <nav className="space-y-2 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out",
                  isActive
                    ? "from-primary to-secondary text-primary-foreground scale-[1.02] transform bg-gradient-to-r shadow-lg"
                    : "text-sidebar-foreground/80 hover:from-primary/10 hover:to-secondary/10 hover:text-sidebar-foreground hover:scale-[1.01] hover:transform hover:bg-gradient-to-r hover:shadow-md",
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300",
                    isActive
                      ? "text-primary-foreground"
                      : "text-sidebar-foreground/60 group-hover:text-primary",
                  )}
                />
                <span className="transition-all duration-300">{item.name}</span>
                {isActive && (
                  <div className="bg-primary-foreground ml-auto h-2 w-2 rounded-full shadow-sm" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer with user info */}
      <div className="border-sidebar-border/50 from-primary/3 via-sidebar to-secondary/3 border-t bg-gradient-to-r p-4">
        <div className="flex flex-col gap-4">
          <div className="bg-sidebar-accent/50 hover:bg-sidebar-accent/60 flex items-center gap-3 rounded-lg p-3 transition-all">
            <Avatar className="border-primary/20 h-10 w-10 border-2">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback className="from-primary/20 to-secondary/20 text-sidebar-foreground bg-gradient-to-br font-medium">
                DL
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sidebar-foreground text-sm font-semibold">
                Dr. Lucas
              </span>
              <span className="text-sidebar-foreground/60 text-xs">
                lucas@exemplo.com
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="hover:from-primary/10 hover:to-secondary/10 border-sidebar-border/50 hover:border-primary/30 w-full justify-start bg-gradient-to-r from-transparent to-transparent transition-all duration-300"
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
