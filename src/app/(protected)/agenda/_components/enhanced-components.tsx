"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, MapPin, Phone, Plus, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CalendarEvent } from "./types";

interface EventTooltipProps {
  event: CalendarEvent;
  position: { x: number; y: number };
  visible: boolean;
}

export function EventTooltip({ event, position, visible }: EventTooltipProps) {
  if (!visible) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendada":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmada":
        return "bg-green-100 text-green-800 border-green-200";
      case "em_andamento":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "concluida":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelada":
        return "bg-red-100 text-red-800 border-red-200";
      case "faltou":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      className="pointer-events-none fixed z-50 w-80 rounded-lg border bg-white p-4 shadow-lg"
      style={{
        left: Math.min(position.x, window.innerWidth - 320),
        top: Math.max(10, position.y - 150),
      }}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">{event.title}</h3>
          <Badge className={cn("text-xs", getStatusColor(event.status))}>
            {event.status.replace("_", " ")}
          </Badge>
        </div>

        {/* Detalhes */}
        <div className="text-muted-foreground space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {format(event.start, "HH:mm", { locale: ptBR })} -{" "}
              {format(event.end, "HH:mm", { locale: ptBR })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{event.tipo.replace("_", " ")}</span>
          </div>

          <div className="flex items-center gap-2">
            {event.modalidade === "presencial" ? (
              <MapPin className="h-4 w-4" />
            ) : (
              <Phone className="h-4 w-4" />
            )}
            <span className="capitalize">{event.modalidade}</span>
          </div>
        </div>

        {/* Observações */}
        {event.observacoes && (
          <div className="text-muted-foreground bg-muted/30 rounded p-2 text-xs">
            {event.observacoes}
          </div>
        )}
      </div>
    </div>
  );
}

interface ConflictIndicatorProps {
  conflictCount: number;
  className?: string;
}

export function ConflictIndicator({
  conflictCount,
  className,
}: ConflictIndicatorProps) {
  if (conflictCount <= 1) return null;

  return (
    <div
      className={cn(
        "absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white",
        className
      )}
    >
      {conflictCount}
    </div>
  );
}

interface TimeIndicatorProps {
  currentTime: Date;
  viewStartHour: number;
  viewEndHour: number;
}

export function TimeIndicator({
  currentTime,
  viewStartHour,
  viewEndHour,
}: TimeIndicatorProps) {
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  // Só mostrar se estiver dentro do horário de visualização
  if (currentHour < viewStartHour || currentHour > viewEndHour) {
    return null;
  }

  // Calcular posição baseada no horário atual
  const minutesFromStart = (currentHour - viewStartHour) * 60 + currentMinute;
  const totalMinutesInView = (viewEndHour - viewStartHour + 1) * 60;
  const topPercent = (minutesFromStart / totalMinutesInView) * 100;

  return (
    <div
      className="pointer-events-none absolute right-0 left-0 z-30"
      style={{ top: `${topPercent}%` }}
    >
      <div className="flex items-center">
        <div className="rounded-l bg-red-500 px-2 py-1 text-xs font-medium text-white">
          {format(currentTime, "HH:mm")}
        </div>
        <div className="h-0.5 flex-1 bg-red-500"></div>
      </div>
    </div>
  );
}

interface QuickCreateButtonProps {
  onQuickCreate: () => void;
  visible: boolean;
}

export function QuickCreateButton({
  onQuickCreate,
  visible,
}: QuickCreateButtonProps) {
  if (!visible) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="bg-primary/5 hover:bg-primary/10 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
      onClick={onQuickCreate}
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
}
