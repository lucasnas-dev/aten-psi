"use client";

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { Consulta, CalendarEvent } from "./types";

interface CalendarViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
}

export function CalendarView({
  currentDate,
  onDateChange,
  events,
  onEventClick,
  onDayClick,
}: CalendarViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.start, date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendada":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmada":
        return "bg-green-100 text-green-800 border-green-200";
      case "realizada":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "cancelada":
        return "bg-red-100 text-red-800 border-red-200";
      case "faltou":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      {/* Header do Calendário */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {format(currentDate, "MMMM yyyy", { locale: ptBR })}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousMonth}
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
            onClick={nextMonth}
            className="h-9 w-9 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cabeçalho dos Dias da Semana */}
      <div className="mb-2 grid grid-cols-7 gap-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
          <div
            key={day}
            className="text-muted-foreground text-center text-sm font-medium py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid do Calendário */}
      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((date) => {
          const dayEvents = getEventsForDay(date);
          const isCurrentDay = isToday(date);

          return (
            <div
              key={date.toISOString()}
              className={cn(
                "min-h-[120px] rounded-lg border p-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                isCurrentDay 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onDayClick(date)}
            >
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isCurrentDay ? "text-primary font-bold" : "text-foreground"
                  )}
                >
                  {format(date, "d")}
                </span>
                {dayEvents.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {dayEvents.length}
                  </Badge>
                )}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "rounded px-2 py-1 text-xs cursor-pointer transition-all duration-200 hover:scale-105",
                      getStatusColor(event.status)
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    <div className="font-medium truncate">
                      {format(event.start, "HH:mm")} - {event.pacienteNome}
                    </div>
                    <div className="opacity-75 truncate">
                      {event.tipo === "avaliacao_inicial" && "Avaliação"}
                      {event.tipo === "psicoterapia" && "Psicoterapia"}
                      {event.tipo === "retorno" && "Retorno"}
                    </div>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-muted-foreground text-xs text-center py-1">
                    +{dayEvents.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
