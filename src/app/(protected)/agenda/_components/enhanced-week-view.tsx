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
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CalendarEvent } from "./types";

interface EnhancedWeekViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date, time: string) => void;
}

export function EnhancedWeekView({
  currentDate,
  onDateChange,
  events,
  onEventClick,
  onTimeSlotClick,
}: EnhancedWeekViewProps) {
  const [viewStartHour, setViewStartHour] = useState(7);
  const [viewEndHour, setViewEndHour] = useState(19);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Gerar slots de tempo (intervalos de 30 minutos)
  const timeSlots: string[] = [];
  for (let hour = viewStartHour; hour <= viewEndHour; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < viewEndHour) {
      timeSlots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }

  const previousWeek = () => {
    onDateChange(subWeeks(currentDate, 1));
  };

  const nextWeek = () => {
    onDateChange(addWeeks(currentDate, 1));
  };

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

  const getEventPosition = (event: CalendarEvent) => {
    const eventTime = format(event.start, "HH:mm");
    const slotIndex = timeSlots.indexOf(eventTime);
    const top = slotIndex * 40; // 40px por slot de 30min

    // Calcular altura baseada na duração
    const duration = Math.round(
      (event.end.getTime() - event.start.getTime()) / (1000 * 60)
    ); // em minutos
    const height = Math.max((duration / 30) * 40, 40); // mínimo 40px

    return { top, height };
  };

  const getEventsForDayAndTime = (day: Date, timeSlot: string) => {
    return events.filter((event) => {
      if (!isSameDay(event.start, day)) return false;
      const eventTime = format(event.start, "HH:mm");
      return eventTime === timeSlot;
    });
  };

  const hasConflict = (day: Date, timeSlot: string) => {
    const dayEvents = events.filter((event) => isSameDay(event.start, day));
    const currentTime = new Date(`2000-01-01T${timeSlot}:00`);

    let conflictCount = 0;
    dayEvents.forEach((event) => {
      const eventStart = new Date(
        `2000-01-01T${format(event.start, "HH:mm")}:00`
      );
      const eventEnd = new Date(`2000-01-01T${format(event.end, "HH:mm")}:00`);

      if (currentTime >= eventStart && currentTime < eventEnd) {
        conflictCount++;
      }
    });

    return conflictCount > 1;
  };

  return (
    <div className="bg-background flex h-full flex-col">
      {/* Header com navegação */}
      <div className="bg-card flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={previousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(weekStart, "d MMM", { locale: ptBR })} -{" "}
            {format(weekEnd, "d MMM yyyy", { locale: ptBR })}
          </h2>
          <Button variant="outline" size="sm" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDateChange(new Date())}
          >
            Hoje
          </Button>
          <select
            value={viewStartHour}
            onChange={(e) => setViewStartHour(Number(e.target.value))}
            className="rounded border px-2 py-1 text-sm"
          >
            {[6, 7, 8, 9].map((hour) => (
              <option key={hour} value={hour}>
                {hour}:00
              </option>
            ))}
          </select>
          <span className="text-muted-foreground text-sm">às</span>
          <select
            value={viewEndHour}
            onChange={(e) => setViewEndHour(Number(e.target.value))}
            className="rounded border px-2 py-1 text-sm"
          >
            {[17, 18, 19, 20, 21, 22].map((hour) => (
              <option key={hour} value={hour}>
                {hour}:00
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid da semana */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-full">
          {/* Header dos dias */}
          <div className="bg-muted/30 sticky top-0 z-10 grid grid-cols-8 border-b">
            <div className="border-r p-2 text-center text-sm font-medium">
              Horário
            </div>
            {daysInWeek.map((day, dayIndex) => (
              <div
                key={`header-${dayIndex}-${format(day, "yyyy-MM-dd")}`}
                className="border-r p-2 text-center"
              >
                <div
                  className={cn(
                    "text-sm font-medium",
                    isToday(day) && "text-primary font-bold"
                  )}
                >
                  {format(day, "EEE", { locale: ptBR })}
                </div>
                <div
                  className={cn(
                    "text-lg",
                    isToday(day) &&
                      "bg-primary text-primary-foreground mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>

          {/* Grid de horários */}
          <div className="relative">
            {timeSlots.map((timeSlot) => (
              <div
                key={timeSlot}
                className="grid min-h-[40px] grid-cols-8 border-b"
              >
                {/* Coluna de horário */}
                <div className="bg-muted/10 text-muted-foreground border-r p-2 text-right text-xs">
                  {timeSlot.endsWith(":00") ? timeSlot : ""}
                </div>

                {/* Colunas dos dias */}
                {daysInWeek.map((day, dayIndex) => {
                  const dayEvents = getEventsForDayAndTime(day, timeSlot);
                  const hasConflictHere = hasConflict(day, timeSlot);

                  return (
                    <div
                      key={`${dayIndex}-${timeSlot}-${format(day, "yyyy-MM-dd")}`}
                      className={cn(
                        "group hover:bg-muted/20 relative cursor-pointer border-r transition-colors",
                        hasConflictHere && "bg-red-50",
                        isToday(day) && "bg-blue-50/30"
                      )}
                      onClick={() => onTimeSlotClick(day, timeSlot)}
                    >
                      {/* Botão de adicionar evento (aparece no hover) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <Plus className="text-muted-foreground h-4 w-4" />
                      </div>

                      {/* Eventos neste slot */}
                      {dayEvents.map((event, eventIndex) => {
                        const position = getEventPosition(event);
                        return (
                          <div
                            key={event.id}
                            className={cn(
                              "absolute right-1 left-1 z-20 cursor-pointer rounded border-l-4 p-1 text-xs shadow-sm",
                              getStatusColor(event.status),
                              "transition-shadow hover:shadow-md"
                            )}
                            style={{
                              top: `${eventIndex * 2}px`, // Offset para eventos sobrepostos
                              height: `${Math.min(position.height, 38)}px`,
                              marginLeft: `${eventIndex * 8}px`, // Offset horizontal para conflitos
                              width: `calc(100% - ${eventIndex * 8}px - 4px)`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick(event);
                            }}
                          >
                            <div className="truncate font-medium">
                              {event.title}
                            </div>
                            <div className="truncate text-xs opacity-75">
                              {format(event.start, "HH:mm")} -{" "}
                              {format(event.end, "HH:mm")}
                            </div>
                          </div>
                        );
                      })}

                      {/* Indicador de conflito */}
                      {hasConflictHere && (
                        <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legenda de status */}
      <div className="bg-card border-t p-3">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-muted-foreground">Status:</span>
          {[
            { status: "agendada", label: "Agendada" },
            { status: "confirmada", label: "Confirmada" },
            { status: "em_andamento", label: "Em Andamento" },
            { status: "concluida", label: "Concluída" },
            { status: "cancelada", label: "Cancelada" },
            { status: "faltou", label: "Faltou" },
          ].map(({ status, label }) => (
            <Badge
              key={status}
              className={cn("text-xs", getStatusColor(status))}
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
