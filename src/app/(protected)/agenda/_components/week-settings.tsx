"use client";

import { Clock, Eye, Palette, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface WeekViewSettingsProps {
  settings: {
    showWeekends: boolean;
    startHour: number;
    endHour: number;
    timeInterval: 30 | 60; // minutos
    showConflicts: boolean;
    showCurrentTime: boolean;
    compactMode: boolean;
  };
  onSettingsChange: (settings: WeekViewSettingsProps["settings"]) => void;
}

export function WeekViewSettings({
  settings,
  onSettingsChange,
}: WeekViewSettingsProps) {
  const updateSetting = (
    key: keyof WeekViewSettingsProps["settings"],
    value: boolean | number
  ) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Configurações
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Configurações de Visualização
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Horário de funcionamento */}
        <div className="space-y-4 p-4">
          <Card className="p-3">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <Label className="text-sm font-medium">
                Horário de Funcionamento
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground text-xs">Início</Label>
                <select
                  value={settings.startHour}
                  onChange={(e) =>
                    updateSetting("startHour", Number(e.target.value))
                  }
                  className="mt-1 w-full rounded border px-2 py-1 text-sm"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 6).map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}:00
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-muted-foreground text-xs">Fim</Label>
                <select
                  value={settings.endHour}
                  onChange={(e) =>
                    updateSetting("endHour", Number(e.target.value))
                  }
                  className="mt-1 w-full rounded border px-2 py-1 text-sm"
                >
                  {Array.from({ length: 8 }, (_, i) => i + 17).map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}:00
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Intervalo de tempo */}
          <div className="flex items-center justify-between">
            <Label className="text-sm">Intervalo de tempo</Label>
            <select
              value={settings.timeInterval}
              onChange={(e) =>
                updateSetting("timeInterval", Number(e.target.value))
              }
              className="rounded border px-2 py-1 text-sm"
            >
              <option value={30}>30 min</option>
              <option value={60}>1 hora</option>
            </select>
          </div>

          {/* Opções de visualização */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Mostrar fins de semana</Label>
              <Switch
                checked={settings.showWeekends}
                onCheckedChange={(checked) =>
                  updateSetting("showWeekends", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Indicar conflitos</Label>
              <Switch
                checked={settings.showConflicts}
                onCheckedChange={(checked) =>
                  updateSetting("showConflicts", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Linha de tempo atual</Label>
              <Switch
                checked={settings.showCurrentTime}
                onCheckedChange={(checked) =>
                  updateSetting("showCurrentTime", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm">Modo compacto</Label>
              <Switch
                checked={settings.compactMode}
                onCheckedChange={(checked) =>
                  updateSetting("compactMode", checked)
                }
              />
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() =>
            onSettingsChange({
              showWeekends: true,
              startHour: 8,
              endHour: 18,
              timeInterval: 30,
              showConflicts: true,
              showCurrentTime: true,
              compactMode: false,
            })
          }
        >
          <Palette className="mr-2 h-4 w-4" />
          Restaurar padrão
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
