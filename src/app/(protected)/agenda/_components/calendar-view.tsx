"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isToday,
  startOfMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CalendarEvent } from "./types";

interface CalendarViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
  compact?: boolean;
  selectedDate?: Date;
}

export function CalendarView({
  currentDate,
  onDateChange,
  events,
  onEventClick,
  onDayClick,
  compact = false,
  selectedDate,
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
    return events.filter((event) => isSameDay(event.start, date));
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
    <div
      className={cn(
        "bg-card rounded-lg border shadow-sm",
        compact ? "p-4" : "p-6"
      )}
    >
      {/* Header do Calendário */}
      <div
        className={cn(
          "flex items-center justify-between",
          compact ? "mb-4" : "mb-6"
        )}
      >
        <h2 className={cn("font-bold", compact ? "text-lg" : "text-2xl")}>
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
          {!compact && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange(new Date())}
            >
              Hoje
            </Button>
          )}
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
      <div className="mb-2 grid grid-cols-7 gap-1">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
          <div
            key={day}
            className={cn(
              "text-muted-foreground py-2 text-center font-medium",
              compact ? "text-xs" : "text-sm"
            )}
          >
            {compact ? day.charAt(0) : day}
          </div>
        ))}
      </div>

      {/* Grid do Calendário */}
      <div className={cn("grid grid-cols-7", compact ? "gap-1.5" : "gap-3")}>
        {daysInMonth.map((date) => {
          const dayEvents = getEventsForDay(date);
          const isCurrentDay = isToday(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);

          return (
            <div
              key={date.toISOString()}
              className={cn(
                "relative aspect-square cursor-pointer rounded-lg border transition-all duration-200 hover:shadow-md",
                compact ? "p-1" : "px-1.5 pt-0 pb-1.5",
                isCurrentDay && !isSelected
                  ? "border-primary bg-primary/5 ring-primary/30 ring-2"
                  : isSelected
                    ? "border-primary bg-primary/20 ring-primary/50 shadow-lg ring-2"
                    : "border-border hover:border-primary/50"
              )}
              onClick={() => onDayClick(date)}
            >
              <div className="absolute top-0.5 left-1">
                <span
                  className={cn(
                    "block leading-[0.5] font-medium",
                    compact ? "text-xs" : "text-sm",
                    isCurrentDay ? "text-primary font-bold" : "text-foreground"
                  )}
                  style={{ lineHeight: "1" }}
                >
                  {format(date, "d")}
                </span>
              </div>

              {dayEvents.length > 0 && (
                <div className="absolute right-1 bottom-1">
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-full bg-blue-500 font-semibold text-white shadow-lg ring-2 ring-blue-600/20 transition-all duration-200 hover:scale-110",
                      compact ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-sm"
                    )}
                  >
                    {dayEvents.length}
                  </div>
                </div>
              )}

              {!compact && (
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "cursor-pointer rounded px-2 py-1 text-xs transition-all duration-200 hover:scale-105",
                        getStatusColor(event.status)
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <div className="truncate font-medium">
                        {format(event.start, "HH:mm")} - {event.pacienteNome}
                      </div>
                      <div className="truncate opacity-75">
                        {event.tipo === "avaliacao_inicial" && "Avaliação"}
                        {event.tipo === "atendimento" && "Atendimento"}
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-muted-foreground py-1 text-center text-xs">
                      +{dayEvents.length - 3} mais
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
