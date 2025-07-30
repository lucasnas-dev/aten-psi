"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Edit,
  MapPin,
  Trash2,
  User,
  Video,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { CalendarEvent } from "./types";

interface EventDetailModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
}

export function EventDetailModal({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: EventDetailModalProps) {
  if (!event) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5" />
            Detalhes da Consulta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge
              className={`px-4 py-2 text-sm ${getStatusColor(event.status)}`}
            >
              {getStatusText(event.status)}
            </Badge>
          </div>

          {/* Informações do Paciente */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-full p-2">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{event.pacienteNome}</h3>
                <p className="text-muted-foreground text-sm">Paciente</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Data e Hora */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-medium">
              <Clock className="h-4 w-4" />
              Data e Horário
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Data</p>
                <p className="font-medium">
                  {format(event.start, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Horário</p>
                <p className="font-medium">
                  {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tipo e Modalidade */}
          <div className="space-y-3">
            <h4 className="font-medium">Informações da Consulta</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Tipo</p>
                <p className="font-medium">{getTipoText(event.tipo)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Modalidade</p>
                <div className="flex items-center gap-2">
                  {event.modalidade === "online" ? (
                    <Video className="h-4 w-4 text-blue-600" />
                  ) : (
                    <MapPin className="h-4 w-4 text-green-600" />
                  )}
                  <span className="font-medium capitalize">
                    {event.modalidade}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          {event.observacoes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Observações</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {event.observacoes}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onEdit(event)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              onClick={() => onDelete(event)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
