"use client";

import { Archive, ArchiveRestore } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

import { archivePatient } from "@/actions/archive-patient";
import { Button } from "@/components/ui/button";

interface ArchiveButtonProps {
  patientId: string;
  currentStatus: string;
}

export function ArchiveButton({
  patientId,
  currentStatus,
}: ArchiveButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { execute: arquivarPaciente, isExecuting } = useAction(archivePatient, {
    onSuccess: () => {
      router.refresh(); // Recarrega a página para atualizar os dados
    },
    onError: (err) => {
      setError(err?.error?.serverError || "Erro ao arquivar paciente");
    },
  });

  const handleArchive = async () => {
    setError(null);
    const novoStatus = currentStatus === "active" ? "inactive" : "active";

    await arquivarPaciente({
      id: patientId,
      status: novoStatus,
    });
  };

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleArchive}
        disabled={isExecuting}
        className="gap-2"
      >
        {isExecuting ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        ) : currentStatus === "active" ? (
          <Archive className="h-4 w-4" />
        ) : (
          <ArchiveRestore className="h-4 w-4" />
        )}
        {isExecuting
          ? "Processando..."
          : currentStatus === "active"
            ? "Arquivar"
            : "Ativar"}
      </Button>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
