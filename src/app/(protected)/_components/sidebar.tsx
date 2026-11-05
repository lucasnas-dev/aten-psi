"use client";

import {
  BarChart3,
  Bell,
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  Moon,
  MoreVertical,
  Settings,
  Sun,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import type { FontScale } from "@/components/theme-provider";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const fontScales: { value: FontScale; label: string; description: string }[] = [
  { value: "compact", label: "-A", description: "Fonte compacta" },
  { value: "default", label: "A", description: "Fonte padrão" },
  { value: "large", label: "+A", description: "Fonte ampliada" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, toggleMode, fontScale, setFontScale } = useTheme();
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
      <div className="hidden h-auto items-start border-b px-3 md:flex md:flex-col">
        <div className="flex w-full items-center justify-between gap-2 py-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold">
              A
            </div>
            <div className="text-foreground text-sm font-bold sm:text-base">
              Aten<span className="text-primary">PSI</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Abrir menu"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  toggleMode();
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    {mode === "light" ? (
                      <span className="bg-foreground h-2.5 w-2.5 rounded-full" />
                    ) : (
                      <span className="border-foreground h-2.5 w-2.5 rounded-full border" />
                    )}
                  </span>
                  Alternar modo
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  router.push("/settings?tab=notifications");
                }}
              >
                <span className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notificações
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                Configurações removido
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              aria-label={item.name}
              aria-current={isActive ? "page" : undefined}
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

      <div
        role="group"
        aria-label="Aparência"
        className="flex flex-wrap items-center justify-end gap-2 border-t px-2 py-1 md:justify-start md:py-2"
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-8 shrink-0 p-0"
          onClick={toggleMode}
          aria-label={
            mode === "light" ? "Ativar modo escuro" : "Ativar modo claro"
          }
          title={mode === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
        >
          {mode === "light" ? <Moon /> : <Sun />}
        </Button>
        <div role="group" aria-label="Tamanho da fonte" className="flex gap-1">
          {fontScales.map((scale) => (
            <Button
              key={scale.value}
              type="button"
              variant={fontScale === scale.value ? "default" : "outline"}
              size="sm"
              className="h-8 min-w-8 px-1.5 text-sm"
              aria-label={scale.description}
              aria-pressed={fontScale === scale.value}
              title={scale.description}
              onClick={() => setFontScale(scale.value)}
            >
              {scale.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="hidden border-t p-2 md:block">
        <div className="mb-2 flex flex-col gap-0.5">
          <p className="text-sidebar-foreground truncate text-sm font-medium">
            {userName}
          </p>
          <p className="text-muted-foreground truncate text-xs">{userEmail}</p>
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
