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
  workingHours?: Array<{
    dayOfWeek: number;
    enabled: boolean;
    timeSlots: Array<{ start: string; end: string }>;
  }>;
  defaultDuration?: number;
}

export function CalendarView({
  currentDate,
  onDateChange,
  events,
  onEventClick,
  onDayClick,
  compact = false,
  selectedDate,
  workingHours = [],
  defaultDuration = 50,
}: CalendarViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Preencher dias do mês anterior para alinhar com o dia da semana
  const firstDayOfWeek = monthStart.getDay(); // 0 = Domingo, 1 = Segunda, etc.
  const previousMonthDays: Date[] = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (i + 1));
    previousMonthDays.push(date);
  }

  // Combinar dias do mês anterior + dias do mês atual
  const allDays = [...previousMonthDays, ...daysInMonth];

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

  const hasAvailableSlots = (date: Date) => {
    const dayOfWeek = date.getDay();
    const dayConfig = workingHours.find((wh) => wh.dayOfWeek === dayOfWeek);

    console.log(
      "Debug - Data:",
      date.toDateString(),
      "DayOfWeek:",
      dayOfWeek,
      "Config:",
      dayConfig
    );

    if (!dayConfig || !dayConfig.enabled || !dayConfig.timeSlots.length) {
      return false;
    }

    const dayEvents = getEventsForDay(date);

    // Calcular minutos totais disponíveis
    const totalAvailableMinutes = dayConfig.timeSlots.reduce((total, slot) => {
      const [startHour, startMin] = slot.start.split(":").map(Number);
      const [endHour, endMin] = slot.end.split(":").map(Number);
      const slotMinutes = endHour * 60 + endMin - (startHour * 60 + startMin);
      return total + slotMinutes;
    }, 0);

    // Calcular minutos ocupados
    const occupiedMinutes = dayEvents.reduce((total, event) => {
      const duration = event.end.getTime() - event.start.getTime();
      return total + duration / 60000; // Converter ms para minutos
    }, 0);

    console.log(
      "Debug - Total disponível:",
      totalAvailableMinutes,
      "Ocupado:",
      occupiedMinutes
    );

    // Retorna true se ainda há pelo menos uma duração padrão disponível
    return totalAvailableMinutes - occupiedMinutes >= defaultDuration;
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
        <h2
          className={cn(
            "font-bold",
            compact ? "text-base sm:text-lg" : "text-lg sm:text-2xl"
          )}
        >
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
              compact ? "text-sm" : "text-sm"
            )}
          >
            {compact ? day.charAt(0) : day}
          </div>
        ))}
      </div>

      {/* Grid do Calendário */}
      <div className={cn("grid grid-cols-7", compact ? "gap-1.5" : "gap-3")}>
        {allDays.map((date) => {
          const dayEvents = getEventsForDay(date);
          const isCurrentDay = isToday(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const hasSlots = hasAvailableSlots(date);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();

          // Verificar se o dia tem horário configurado
          const dayOfWeek = date.getDay();
          const dayConfig = workingHours.find(
            (wh) => wh.dayOfWeek === dayOfWeek
          );
          const hasWorkingHours =
            dayConfig?.enabled && dayConfig?.timeSlots?.length > 0;

          return (
            <div
              key={date.toISOString()}
              className={cn(
                "relative aspect-square cursor-pointer rounded-lg border transition-all duration-200 hover:shadow-md",
                compact ? "p-1" : "px-1.5 pt-0 pb-1.5",
                !isCurrentMonth && "opacity-40",
                isCurrentDay && !isSelected
                  ? "border-primary bg-primary/5 ring-primary/30 ring-2"
                  : isSelected && hasSlots
                    ? "border-green-500 bg-green-500/20 shadow-lg ring-2 ring-green-500/50"
                    : isSelected && !hasSlots
                      ? "border-red-500 bg-red-500/20 shadow-lg ring-2 ring-red-500/50"
                      : "border-border hover:border-primary/50"
              )}
              onClick={() => onDayClick(date)}
            >
              <div className="absolute top-0.5 left-1">
                <span
                  className={cn(
                    "block leading-[0.5] font-medium",
                    compact ? "text-sm" : "text-sm",
                    isCurrentDay ? "text-primary font-bold" : "text-foreground"
                  )}
                  style={{ lineHeight: "1" }}
                >
                  {format(date, "d")}
                </span>
              </div>

              {!hasWorkingHours && isCurrentMonth && (
                <div className="absolute top-0.5 right-1">
                  <div className="text-muted-foreground flex h-4 w-4 items-center justify-center text-[9px] font-bold opacity-50 sm:text-[10px]">
                    ✕
                  </div>
                </div>
              )}

              {dayEvents.length > 0 && (
                <div className="absolute right-1 bottom-1">
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-full bg-blue-500 font-semibold text-white shadow-lg ring-2 ring-blue-600/20 transition-all duration-200 hover:scale-110",
                      compact
                        ? "h-6 w-6 text-[9px] sm:text-[10px]"
                        : "h-8 w-8 text-sm"
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
                        "cursor-pointer rounded px-2 py-1 text-sm transition-all duration-200 hover:scale-105",
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
                    <div className="text-muted-foreground py-1 text-center text-sm">
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
