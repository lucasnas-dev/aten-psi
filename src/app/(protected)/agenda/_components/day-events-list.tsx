"use client";

import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, MapPin, User, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { CalendarEvent } from "./types";

interface DayEventsListProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date) => void;
}

export function DayEventsList({
  selectedDate,
  events,
  onEventClick,
  onTimeSlotClick,
}: DayEventsListProps) {
  const dayEvents = events.filter(event => isSameDay(event.start, selectedDate));

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
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Agenda do dia {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </CardTitle>
          <Button
            onClick={handleNewAppointment}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Consulta
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {dayEvents.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              <Clock className="mx-auto h-12 w-12 opacity-50" />
              <p className="text-lg font-medium mt-2">Nenhuma consulta agendada</p>
              <p className="text-sm">
                Clique em "Nova Consulta" para agendar uma consulta para este dia
              </p>
            </div>
          </div>
        ) : (
          dayEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{event.pacienteNome}</span>
                <span className="text-sm text-muted-foreground">• {getTipoLabel(event.tipo)}</span>
                <span className="text-sm text-muted-foreground">• {event.modalidade === "presencial" ? "Presencial" : "Online"}</span>
              </div>
              <Badge className={cn("text-xs", getStatusColor(event.status))}>
                {getStatusLabel(event.status)}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
