"use client";

import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addWeeks,
  subWeeks,
  isSameDay,
  isToday,
  addHours,
  startOfDay
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  onTimeSlotClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Horários das 8h às 18h (intervalos de 30min)
  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? 0 : 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const previousWeek = () => {
    onDateChange(subWeeks(currentDate, 1));
  };

  const nextWeek = () => {
    onDateChange(addWeeks(currentDate, 1));
  };

  const getEventsForDayAndTime = (day: Date, timeSlot: string) => {
    return events.filter(event => {
      const eventDate = format(event.start, "yyyy-MM-dd");
      const eventTime = format(event.start, "HH:mm");
      const dayString = format(day, "yyyy-MM-dd");
      
      return eventDate === dayString && eventTime === timeSlot;
    });
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
            {format(weekStart, "d MMM", { locale: ptBR })} - {format(weekEnd, "d MMM yyyy", { locale: ptBR })}
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

      {/* Grid da Semana */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Cabeçalho dos Dias */}
          <div className="border-b bg-gray-50/50">
            <div className="grid grid-cols-8">
              <div className="p-4 text-center text-sm font-medium text-muted-foreground">
                Hora
              </div>
              {daysInWeek.map((day) => (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "p-4 text-center",
                    isToday(day) ? "bg-primary/10" : ""
                  )}
                >
                  <div className="text-sm font-medium">
                    {format(day, "EEE", { locale: ptBR })}
                  </div>
                  <div className={cn(
                    "text-2xl font-bold mt-1",
                    isToday(day) ? "text-primary" : "text-foreground"
                  )}>
                    {format(day, "d")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid de Horários */}
          <div className="max-h-[600px] overflow-y-auto">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="border-b border-gray-100 last:border-b-0">
                <div className="grid grid-cols-8 min-h-[60px]">
                  {/* Coluna do Horário */}
                  <div className="border-r p-3 text-center text-sm font-medium text-muted-foreground">
                    {timeSlot}
                  </div>

                  {/* Colunas dos Dias */}
                  {daysInWeek.map((day) => {
                    const dayEvents = getEventsForDayAndTime(day, timeSlot);
                    const hasEvents = dayEvents.length > 0;

                    return (
                      <div
                        key={`${day.toISOString()}-${timeSlot}`}
                        className="border-r last:border-r-0 p-1 relative"
                      >
                        {hasEvents ? (
                          <div className="space-y-1">
                            {dayEvents.map((event) => (
                              <div
                                key={event.id}
                                className={cn(
                                  "cursor-pointer rounded px-2 py-1 text-xs text-white transition-all duration-200 hover:scale-105",
                                  getStatusColor(event.status)
                                )}
                                onClick={() => onEventClick(event)}
                                title={`${event.pacienteNome} - ${event.tipo}`}
                              >
                                <div className="font-medium truncate">
                                  {event.pacienteNome}
                                </div>
                                <div className="opacity-90 truncate">
                                  {event.tipo === "avaliacao_inicial" && "Avaliação"}
                                  {event.tipo === "psicoterapia" && "Psicoterapia"}
                                  {event.tipo === "retorno" && "Retorno"}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <button
                            className="hover:bg-gray-50 h-full w-full rounded transition-colors"
                            onClick={() => {
                              const [hour, minute] = timeSlot.split(':').map(Number);
                              const slotDate = addHours(startOfDay(day), hour + minute / 60);
                              onTimeSlotClick(slotDate);
                            }}
                            title="Clique para agendar"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
