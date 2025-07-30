// Exemplo de uso das novas actions de gerenciamento de consultas

import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";

import {
  createConsultation,
  deleteConsultation,
  getConsultation,
  updateConsultation,
} from "@/actions/manage-consultation";

export function ConsultationManager() {
  // Hook para criar consulta
  const { execute: executeCreate, status: createStatus } = useAction(
    createConsultation,
    {
      onSuccess: ({ data }) => {
        console.log("Consulta criada:", data);
        // Aqui você pode atualizar o estado local, mostrar notificação, etc.
      },
      onError: ({ error }) => {
        console.error("Erro ao criar consulta:", error);
      },
    }
  );

  // Hook para atualizar consulta
  const { execute: executeUpdate, status: updateStatus } = useAction(
    updateConsultation,
    {
      onSuccess: ({ data }) => {
        console.log("Consulta atualizada:", data);
      },
      onError: ({ error }) => {
        console.error("Erro ao atualizar consulta:", error);
      },
    }
  );

  // Hook para excluir consulta
  const { execute: executeDelete, status: deleteStatus } = useAction(
    deleteConsultation,
    {
      onSuccess: ({ data }) => {
        console.log("Consulta excluída:", data);
      },
      onError: ({ error }) => {
        console.error("Erro ao excluir consulta:", error);
      },
    }
  );

  // Hook para buscar consulta específica
  const { execute: executeGet, status: getStatus } = useAction(
    getConsultation,
    {
      onSuccess: ({ data }) => {
        console.log("Consulta encontrada:", data);
      },
      onError: ({ error }) => {
        console.error("Erro ao buscar consulta:", error);
      },
    }
  );

  // Função para criar uma nova consulta
  const handleCreateConsultation = () => {
    executeCreate({
      patient_id: "patient-id-123",
      date: "2025-07-30",
      time: "14:30",
      duration: "60",
      type: "atendimento",
      modality: "presencial",
      notes: "Primeira consulta de atendimento",
      status: "agendada",
    });
  };

  // Função para atualizar consulta
  const handleUpdateConsultation = (consultationId: string) => {
    executeUpdate({
      id: consultationId,
      data: {
        status: "concluida",
        notes:
          "Consulta realizada com sucesso. Paciente demonstrou boa evolução.",
        // Apenas os campos que você quer atualizar
      },
    });
  };

  // Função para excluir consulta
  const handleDeleteConsultation = (consultationId: string) => {
    if (confirm("Tem certeza que deseja excluir esta consulta?")) {
      executeDelete({
        id: consultationId,
      });
    }
  };

  // Função para buscar consulta específica
  const handleGetConsultation = (consultationId: string) => {
    executeGet({
      id: consultationId,
    });
  };

  return (
    <div className="space-y-4">
      <h2>Gerenciamento de Consultas</h2>

      {/* Botões de exemplo */}
      <div className="flex space-x-2">
        <button
          onClick={handleCreateConsultation}
          disabled={createStatus === "executing"}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        >
          {createStatus === "executing" ? "Criando..." : "Criar Consulta"}
        </button>

        <button
          onClick={() => handleUpdateConsultation("consulta-id-123")}
          disabled={updateStatus === "executing"}
          className="rounded bg-green-500 px-4 py-2 text-white disabled:opacity-50"
        >
          {updateStatus === "executing"
            ? "Atualizando..."
            : "Atualizar Consulta"}
        </button>

        <button
          onClick={() => handleDeleteConsultation("consulta-id-123")}
          disabled={deleteStatus === "executing"}
          className="rounded bg-red-500 px-4 py-2 text-white disabled:opacity-50"
        >
          {deleteStatus === "executing" ? "Excluindo..." : "Excluir Consulta"}
        </button>

        <button
          onClick={() => handleGetConsultation("consulta-id-123")}
          disabled={getStatus === "executing"}
          className="rounded bg-gray-500 px-4 py-2 text-white disabled:opacity-50"
        >
          {getStatus === "executing" ? "Buscando..." : "Buscar Consulta"}
        </button>
      </div>
    </div>
  );
}

// Exemplo de uso com formulário de edição
export function EditConsultationForm({
  consultationId,
}: {
  consultationId: string;
}) {
  const { execute: executeUpdate, status: updateStatus } =
    useAction(updateConsultation);
  const { execute: executeGet, result: getResult } = useAction(getConsultation);

  // Buscar dados da consulta ao montar o componente
  useEffect(() => {
    executeGet({ id: consultationId });
  }, [consultationId, executeGet]);

  // Exemplo de como atualizar campos específicos
  const handleStatusChange = (
    newStatus:
      | "agendada"
      | "confirmada"
      | "em_andamento"
      | "concluida"
      | "cancelada"
      | "faltou"
  ) => {
    executeUpdate({
      id: consultationId,
      data: {
        status: newStatus,
      },
    });
  };

  const handleNotesUpdate = (notes: string) => {
    executeUpdate({
      id: consultationId,
      data: {
        notes,
      },
    });
  };

  const handleDateTimeUpdate = (date: string, time: string) => {
    executeUpdate({
      id: consultationId,
      data: {
        date,
        time,
      },
    });
  };

  return (
    <div className="space-y-4">
      <h3>Editar Consulta</h3>

      {getResult?.data && (
        <div className="space-y-2">
          <p>Consulta atual: {JSON.stringify(getResult.data)}</p>

          {/* Exemplo de botões para atualizar status */}
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChange("confirmada")}
              disabled={updateStatus === "executing"}
              className="rounded bg-green-500 px-3 py-1 text-white disabled:opacity-50"
            >
              Confirmar
            </button>
            <button
              onClick={() => handleStatusChange("concluida")}
              disabled={updateStatus === "executing"}
              className="rounded bg-blue-500 px-3 py-1 text-white disabled:opacity-50"
            >
              Concluir
            </button>
            <button
              onClick={() => handleStatusChange("cancelada")}
              disabled={updateStatus === "executing"}
              className="rounded bg-red-500 px-3 py-1 text-white disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>

          {/* Exemplo de atualização de notas */}
          <button
            onClick={() => handleNotesUpdate("Consulta realizada com sucesso!")}
            disabled={updateStatus === "executing"}
            className="rounded bg-purple-500 px-3 py-1 text-white disabled:opacity-50"
          >
            Adicionar Notas
          </button>

          {/* Exemplo de reagendamento */}
          <button
            onClick={() => handleDateTimeUpdate("2025-08-01", "15:00")}
            disabled={updateStatus === "executing"}
            className="rounded bg-orange-500 px-3 py-1 text-white disabled:opacity-50"
          >
            Reagendar para 01/08 às 15:00
          </button>
        </div>
      )}
    </div>
  );
}
