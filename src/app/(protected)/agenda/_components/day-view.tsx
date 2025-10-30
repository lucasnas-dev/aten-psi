"use client";

import { addHours, format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, MapPin, User, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CalendarEvent } from "./types";

interface DayViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date) => void;
  workingHours?: Array<{
    dayOfWeek: number;
    enabled: boolean;
    timeSlots: Array<{ start: string; end: string }>;
  }>;
}

export function DayView({
  selectedDate,
  events,
  onEventClick,
  onTimeSlotClick,
  workingHours = [],
}: DayViewProps) {
  // Obter horários de trabalho para o dia selecionado
  const dayOfWeek = selectedDate.getDay();
  const dayWorkingHours = workingHours.find((wh) => wh.dayOfWeek === dayOfWeek);

  // Função para gerar time slots baseados nos horários de trabalho
  const generateTimeSlots = () => {
    if (!dayWorkingHours?.enabled || !dayWorkingHours.timeSlots.length) {
      // Horários padrão se não houver configuração: 8h às 18h
      return Array.from({ length: 20 }, (_, i) => {
        const hour = 8 + Math.floor(i / 2);
        const minute = i % 2 === 0 ? 0 : 30;
        return addHours(startOfDay(selectedDate), hour + minute / 60);
      });
    }

    const slots: Date[] = [];
    dayWorkingHours.timeSlots.forEach((timeSlot) => {
      const [startHour, startMinute] = timeSlot.start.split(":").map(Number);
      const [endHour, endMinute] = timeSlot.end.split(":").map(Number);

      let currentHour = startHour;
      let currentMinute = startMinute;

      while (
        currentHour < endHour ||
        (currentHour === endHour && currentMinute < endMinute)
      ) {
        const slotDate = new Date(selectedDate);
        slotDate.setHours(currentHour, currentMinute, 0, 0);
        slots.push(slotDate);

        // Avançar 30 minutos
        currentMinute += 30;
        if (currentMinute >= 60) {
          currentMinute = 0;
          currentHour += 1;
        }
      }
    });

    return slots;
  };

  // Gerar horários
  const timeSlots = generateTimeSlots();

  const getEventsForTimeSlot = (time: Date) => {
    return events.filter(
      (event) =>
        format(event.start, "HH:mm") === format(time, "HH:mm") &&
        format(event.start, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendada":
        return "border-l-blue-500 bg-blue-50";
      case "confirmada":
        return "border-l-green-500 bg-green-50";
      case "realizada":
        return "border-l-purple-500 bg-purple-50";
      case "cancelada":
        return "border-l-red-500 bg-red-50";
      case "faltou":
        return "border-l-orange-500 bg-orange-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "agendada":
        return "bg-blue-100 text-blue-800";
      case "confirmada":
        return "bg-green-100 text-green-800";
      case "realizada":
        return "bg-purple-100 text-purple-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      case "faltou":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "agendada":
        return "Agendada";
      case "confirmada":
        return "Confirmada";
      case "realizada":
        return "Realizada";
      case "cancelada":
        return "Cancelada";
      case "faltou":
        return "Faltou";
      default:
        return status;
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      {/* Header */}
      <div className="border-b p-6">
        <h2 className="text-2xl font-bold">
          {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
            locale: ptBR,
          })}
        </h2>
        <p className="text-muted-foreground mt-1">
          {events.length} consulta{events.length !== 1 ? "s" : ""} agendada
          {events.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Timeline */}
      <div className="max-h-[600px] overflow-y-auto">
        <div className="p-4">
          <div className="space-y-1">
            {timeSlots.map((timeSlot) => {
              const slotEvents = getEventsForTimeSlot(timeSlot);
              const isEmpty = slotEvents.length === 0;

              return (
                <div key={timeSlot.toISOString()} className="flex">
                  {/* Time Label */}
                  <div className="w-20 flex-shrink-0 py-3 pr-4">
                    <span className="text-muted-foreground text-sm font-medium">
                      {format(timeSlot, "HH:mm")}
                    </span>
                  </div>

                  {/* Event Area */}
                  <div className="min-h-[60px] flex-1">
                    {isEmpty ? (
                      <Button
                        variant="ghost"
                        className="border-border hover:border-primary hover:bg-primary/5 h-full w-full justify-start border-2 border-dashed transition-all duration-200"
                        onClick={() => onTimeSlotClick(timeSlot)}
                      >
                        <span className="text-muted-foreground text-sm">
                          Clique para agendar
                        </span>
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        {slotEvents.map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "cursor-pointer rounded-lg border-l-4 p-4 transition-all duration-200 hover:shadow-md",
                              getStatusColor(event.status)
                            )}
                            onClick={() => onEventClick(event)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="mb-2 flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span className="font-medium">
                                    {event.pacienteNome}
                                  </span>
                                  <Badge
                                    className={getStatusBadgeColor(
                                      event.status
                                    )}
                                  >
                                    {getStatusText(event.status)}
                                  </Badge>
                                </div>

                                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {format(event.start, "HH:mm")} -{" "}
                                    {format(event.end, "HH:mm")}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {event.modalidade === "online" ? (
                                      <Video className="h-3 w-3" />
                                    ) : (
                                      <MapPin className="h-3 w-3" />
                                    )}
                                    {event.modalidade === "online"
                                      ? "Online"
                                      : "Presencial"}
                                  </div>
                                </div>

                                {event.observacoes && (
                                  <p className="text-muted-foreground mt-2 text-sm">
                                    {event.observacoes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
