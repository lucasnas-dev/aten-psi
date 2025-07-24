"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Calendar,
  Clock, 
  User, 
  MapPin, 
  Video,
  Phone,
  Mail,
  Edit,
  Trash2
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { CalendarEvent } from "./types";

interface ListViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
}

export function ListView({
  events,
  onEventClick,
  onEditEvent,
  onDeleteEvent,
}: ListViewProps) {
  const getStatusColor = (status: string) => {
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

  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case "avaliacao_inicial":
        return "Avaliação Inicial";
      case "psicoterapia":
        return "Psicoterapia";
      case "retorno":
        return "Retorno";
      case "online":
        return "Online";
      case "presencial":
        return "Presencial";
      default:
        return tipo;
    }
  };

  // Ordenar eventos por data/hora
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  if (events.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-12 text-center shadow-sm">
        <Calendar className="text-muted-foreground mx-auto h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhuma consulta encontrada</h3>
        <p className="text-muted-foreground mb-6">
          Não há consultas agendadas para os filtros selecionados.
        </p>
        <Button>Nova Consulta</Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-2xl font-bold">Lista de Consultas</h2>
        <p className="text-muted-foreground mt-1">
          {events.length} consulta{events.length !== 1 ? 's' : ''} encontrada{events.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Data & Hora</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Modalidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEvents.map((event) => (
              <TableRow
                key={event.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onEventClick(event)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-full p-2">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{event.pacienteNome}</div>
                      <div className="text-muted-foreground text-sm">
                        ID: {event.id.slice(0, 8)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <div>
                      <div className="font-medium">
                        {format(event.start, "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                      <div className="text-muted-foreground text-sm flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="outline">
                    {getTipoText(event.tipo)}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    {event.modalidade === "online" ? (
                      <Video className="text-blue-600 h-4 w-4" />
                    ) : (
                      <MapPin className="text-green-600 h-4 w-4" />
                    )}
                    <span className="capitalize">{event.modalidade}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge className={getStatusColor(event.status)}>
                    {getStatusText(event.status)}
                  </Badge>
                </TableCell>

                <TableCell className="max-w-xs">
                  {event.observacoes ? (
                    <span className="text-sm truncate">{event.observacoes}</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvent(event);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEvent(event);
                      }}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
