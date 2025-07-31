"use client";

import { useAction } from "next-safe-action/hooks";

import { updateConsultation } from "@/actions/manage-consultation";
import { Button } from "@/components/ui/button";

import { CalendarEvent } from "./types";

interface QuickActionsProps {
  event: CalendarEvent;
  onSuccess: () => void;
}

export function QuickActions({ event, onSuccess }: QuickActionsProps) {
  const { execute: executeUpdate, status } = useAction(updateConsultation, {
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error("Erro ao atualizar status:", error);
    },
  });

  const handleStatusChange = (
    newStatus:
      | "confirmada"
      | "em_andamento"
      | "concluida"
      | "cancelada"
      | "faltou"
  ) => {
    console.log("Atualizando consulta:", event.id, "para status:", newStatus);
    executeUpdate({
      id: event.id,
      data: {
        status: newStatus,
      },
    });
  };

  const currentStatus = event.status;
  const isLoading = status === "executing";

  return (
    <div className="flex flex-wrap gap-2">
      {/* Confirmar consulta */}
      {currentStatus === "agendada" && (
        <Button
          size="sm"
          variant="outline"
          className="border-green-200 text-green-600 hover:bg-green-50"
          onClick={() => handleStatusChange("confirmada")}
          disabled={isLoading}
        >
          ✓ Confirmar
        </Button>
      )}

      {/* Iniciar consulta */}
      {(currentStatus === "agendada" || currentStatus === "confirmada") && (
        <Button
          size="sm"
          variant="outline"
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
          onClick={() => handleStatusChange("em_andamento")}
          disabled={isLoading}
        >
          ▶ Iniciar
        </Button>
      )}

      {/* Concluir consulta */}
      {currentStatus === "em_andamento" && (
        <Button
          size="sm"
          variant="outline"
          className="border-purple-200 text-purple-600 hover:bg-purple-50"
          onClick={() => handleStatusChange("concluida")}
          disabled={isLoading}
        >
          ✓ Concluir
        </Button>
      )}

      {/* Marcar como faltou */}
      {(currentStatus === "agendada" || currentStatus === "confirmada") && (
        <Button
          size="sm"
          variant="outline"
          className="border-orange-200 text-orange-600 hover:bg-orange-50"
          onClick={() => handleStatusChange("faltou")}
          disabled={isLoading}
        >
          ⚠ Faltou
        </Button>
      )}

      {/* Cancelar consulta */}
      {(currentStatus === "agendada" || currentStatus === "confirmada") && (
        <Button
          size="sm"
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50"
          onClick={() => handleStatusChange("cancelada")}
          disabled={isLoading}
        >
          ✕ Cancelar
        </Button>
      )}
    </div>
  );
}
