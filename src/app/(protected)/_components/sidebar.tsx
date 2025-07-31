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

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Painel", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pacientes", href: "/patients", icon: Users },
  { name: "Agenda", href: "/agenda", icon: Calendar },
  { name: "Prontuários", href: "/prontuarios", icon: FileText },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Configurações", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut();
      // O middleware irá detectar a ausência da sessão e redirecionar automaticamente
      window.location.href = "/authentication/login";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Em caso de erro, forçar redirecionamento
      window.location.href = "/authentication/login";
    }
  };

  const userName = session?.user?.name || "Usuário";
  const userEmail = session?.user?.email || "email@exemplo.com";

  return (
    <div className="bg-sidebar fixed top-0 left-0 z-40 flex h-screen w-48 flex-col border-r shadow-lg">
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
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-xl px-3 py-2 text-base font-medium transition-all duration-300 ease-in-out",
                  isActive
                    ? "from-primary to-secondary text-primary-foreground scale-[1.02] transform bg-gradient-to-r shadow-lg"
                    : "text-sidebar-foreground/80 hover:from-primary/10 hover:to-secondary/10 hover:text-sidebar-foreground hover:scale-[1.01] hover:transform hover:bg-gradient-to-r hover:shadow-md"
                )}
              >
                <Icon
                  className={cn(
                    "mr-2 h-5 w-5 flex-shrink-0 transition-all duration-300",
                    isActive
                      ? "text-primary-foreground"
                      : "text-sidebar-foreground/60 group-hover:text-primary"
                  )}
                />
                <span className="transition-all duration-300">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer with user name, email and logout */}
      <div className="border-sidebar-border/50 from-primary/3 via-sidebar to-secondary/3 border-t bg-gradient-to-r p-3">
        <div className="flex flex-col gap-3">
          {/* Nome do Psicólogo */}
          <div className="text-center">
            <span className="text-sidebar-foreground text-sm font-semibold">
              Psi. {userName}
            </span>
          </div>

          {/* Email do Usuário */}
          <div className="text-center">
            <span className="text-sidebar-foreground/60 text-xs">
              {userEmail}
            </span>
          </div>

          {/* Botão Sair */}
          <Button
            variant="outline"
            className="hover:from-primary/10 hover:to-secondary/10 border-sidebar-border/50 hover:border-primary/30 w-full justify-center bg-gradient-to-r from-transparent to-transparent transition-all duration-300"
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
