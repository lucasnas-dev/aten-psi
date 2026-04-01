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
  { name: "Prontuários", href: "/records", icon: FileText },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Configurações", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/authentication/login";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      window.location.href = "/authentication/login";
    }
  };

  const userName = session?.user?.name || "Usuário";
  const userEmail = session?.user?.email || "email@exemplo.com";

  return (
    <div className="sidebar-shell bg-sidebar sticky top-0 z-40 flex w-full flex-col border-b md:top-0 md:w-44 md:flex-shrink-0 md:border-r md:border-b-0">
      {/* Header */}
      <div className="hidden h-14 items-center border-b px-3 md:flex">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold shadow-sm">
            A
          </div>
          <div className="text-foreground text-sm font-bold sm:text-base">
            Aten<span className="text-primary">PSI</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-1 overflow-x-auto px-2 py-1.5 md:flex-1 md:flex-col md:items-stretch md:space-y-0.5 md:overflow-visible md:p-2">
        <div className="bg-primary text-primary-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold md:hidden">
          A
        </div>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "sidebar-link shrink-0 px-2 py-1 text-xs sm:text-sm md:shrink md:px-2 md:py-1.5",
                isActive && "sidebar-link-active"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden truncate sm:inline md:inline">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="hidden border-t p-2 md:block">
        <div className="mb-2 flex flex-col gap-0.5">
          <p className="text-sidebar-foreground truncate text-sm font-medium">
            {userName}
          </p>
          <p className="text-muted-foreground truncate text-[10px]">
            {userEmail}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-full justify-start px-2 text-sm"
          onClick={handleLogout}
        >
          <LogOut className="mr-1.5 h-3 w-3" />
          Sair
        </Button>
      </div>
    </div>
  );
}
