"use client";

import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CalendarEvent } from "./types";

interface WeekViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date) => void;
}

export function WeekView({
  currentDate,
  onDateChange,
  events,
  onEventClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Horários das 8h às 18h (intervalos de 30min)

  const previousWeek = () => {
    onDateChange(subWeeks(currentDate, 1));
  };

  const nextWeek = () => {
    onDateChange(addWeeks(currentDate, 1));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendada":
        return "bg-blue-500 border-blue-600";
      case "confirmada":
        return "bg-green-500 border-green-600";
      case "realizada":
        return "bg-purple-500 border-purple-600";
      case "cancelada":
        return "bg-red-500 border-red-600";
      case "faltou":
        return "bg-orange-500 border-orange-600";
      default:
        return "bg-gray-500 border-gray-600";
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      {/* Header */}
      <div className="border-b p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {format(weekStart, "d MMM", { locale: ptBR })} -{" "}
            {format(weekEnd, "d MMM yyyy", { locale: ptBR })}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousWeek}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange(new Date())}
            >
              Hoje
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextWeek}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Lista única de eventos da semana */}
      <div className="p-6">
        <ul className="space-y-2">
          {daysInWeek.map((day) => {
            const dayEvents = events.filter((event) =>
              isSameDay(event.start, day)
            );
            if (dayEvents.length === 0) return null;
            return (
              <li key={day.toISOString()}>
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={cn(
                      "font-bold",
                      isToday(day) ? "text-primary" : "text-foreground"
                    )}
                  >
                    {format(day, "EEE, d MMM", { locale: ptBR })}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {dayEvents.length} consulta
                    {dayEvents.length === 1 ? "" : "s"}
                  </Badge>
                </div>
                <ul className="ml-4 space-y-1">
                  {dayEvents.map((event) => (
                    <li
                      key={event.id}
                      className="bg-card hover:bg-muted/70 flex cursor-pointer items-center justify-between rounded border px-2 py-1 transition-colors"
                      onClick={() => onEventClick(event)}
                    >
                      <span className="font-medium">{event.pacienteNome}</span>
                      <span className="text-muted-foreground text-xs">
                        {event.tipo === "avaliacao_inicial"
                          ? "Avaliação"
                          : event.tipo === "atendimento"
                            ? "Atendimento"
                            : "Retorno"}
                      </span>
                      <Badge
                        className={cn("text-xs", getStatusColor(event.status))}
                      >
                        {event.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        {daysInWeek.every(
          (day) =>
            events.filter((event) => isSameDay(event.start, day)).length === 0
        ) && (
          <div className="text-muted-foreground mt-4 text-sm">
            Nenhum evento na semana
          </div>
        )}
      </div>
    </div>
  );
}
