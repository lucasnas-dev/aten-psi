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
    <div className="sidebar-shell bg-sidebar flex w-full flex-col border-b md:sticky md:top-0 md:z-40 md:w-44 md:flex-shrink-0 md:border-r md:border-b-0">
      {/* Header */}
      <div className="flex h-14 items-center border-b px-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold shadow-sm">
            A
          </div>
          <div className="text-foreground text-base font-bold">
            Aten<span className="text-primary">PSI</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex gap-1 overflow-x-auto p-2 md:flex-1 md:flex-col md:space-y-0.5 md:overflow-visible">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "sidebar-link shrink-0 text-sm md:shrink",
                isActive && "sidebar-link-active"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="hidden border-t p-2 md:block">
        <div className="mb-2 flex flex-col gap-0.5">
          <p className="text-sidebar-foreground truncate text-xs font-medium">
            {userName}
          </p>
          <p className="text-muted-foreground truncate text-[10px]">
            {userEmail}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-full justify-start px-2 text-xs"
          onClick={handleLogout}
        >
          <LogOut className="mr-1.5 h-3 w-3" />
          Sair
        </Button>
      </div>
    </div>
  );
}
