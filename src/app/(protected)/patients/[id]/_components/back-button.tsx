"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    // Usa o histórico do navegador para voltar
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback para a lista de pacientes se não houver histórico
      router.push("/patients");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleBack}
      className="gap-2"
    >
      <ArrowLeft className="h-4 w-4" />
      Voltar
    </Button>
  );
}
