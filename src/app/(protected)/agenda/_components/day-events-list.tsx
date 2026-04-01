"use client";

import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarPlus, Clock, Settings, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { CalendarEvent } from "./types";

interface DayEventsListProps {
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

export function DayEventsList({
  selectedDate,
  events,
  onEventClick,
  workingHours = [],
}: DayEventsListProps) {
  const dayEvents = events.filter((event) =>
    isSameDay(event.start, selectedDate)
  );

  // Verificar se o dia tem horário configurado
  const dayOfWeek = selectedDate.getDay();
  const dayConfig = workingHours.find((wh) => wh.dayOfWeek === dayOfWeek);
  const hasWorkingHours =
    dayConfig?.enabled && dayConfig?.timeSlots?.length > 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendada":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmada":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelada":
        return "bg-red-100 text-red-800 border-red-200";
      case "concluida":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "agendada":
        return "Agendada";
      case "confirmada":
        return "Confirmada";
      case "cancelada":
        return "Cancelada";
      case "concluida":
        return "Concluída";
      default:
        return "Desconhecido";
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "avaliacao_inicial":
        return "Avaliação Inicial";
      case "psicoterapia":
        return "Psicoterapia";
      case "retorno":
        return "Retorno";
      default:
        return "Consulta";
    }
  };

  const handleNewAppointment = () => {
    window.location.href = "/patients";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg">
            Agenda do dia{" "}
            {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </CardTitle>
          <Button
            onClick={handleNewAppointment}
            variant="outline"
            size="sm"
            className="h-8 gap-2 px-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <CalendarPlus className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Agendar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!hasWorkingHours ? (
          <div className="py-8 text-center">
            <div className="text-muted-foreground mb-4">
              <Clock className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-2 text-base font-medium sm:text-lg">
                Sem horário de atendimento
              </p>
              <p className="mb-4 text-sm">
                Este dia não possui horários configurados para atendimento.
              </p>
              <Button
                onClick={() =>
                  (window.location.href = "/settings?tab=working-hours")
                }
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Configurar Horários
              </Button>
            </div>
          </div>
        ) : dayEvents.length === 0 ? (
          <div className="py-8 text-center">
            <div className="text-muted-foreground mb-4">
              <Clock className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-2 text-base font-medium sm:text-lg">
                Nenhuma consulta agendada
              </p>
              <p className="text-sm">
                Clique em {'"'}Nova Consulta{'"'} para agendar uma consulta para
                este dia
              </p>
            </div>
          </div>
        ) : (
          dayEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className="hover:bg-muted/50 flex flex-wrap items-center justify-between gap-2 rounded-lg border p-4 transition-colors"
            >
              <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
                <User className="text-muted-foreground h-4 w-4" />
                <span className="truncate text-sm font-medium sm:text-base">
                  {event.pacienteNome}
                </span>
                <span className="text-muted-foreground text-sm">
                  • {getTipoLabel(event.tipo)}
                </span>
                <span className="text-muted-foreground text-sm">
                  •{" "}
                  {event.modalidade === "presencial" ? "Presencial" : "Online"}
                </span>
              </div>
              <Badge
                className={cn(
                  "text-[10px] sm:text-sm",
                  getStatusColor(event.status)
                )}
              >
                {getStatusLabel(event.status)}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
