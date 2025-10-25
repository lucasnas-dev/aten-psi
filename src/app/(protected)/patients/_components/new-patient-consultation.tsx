import { CalendarPlus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { NewConsultationModal } from "../../agenda/_components";
import { Patient } from "./types";

export function NewPatientConsultation({ patient }: { patient: Patient }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="h-8 gap-1.5 border-purple-300 bg-purple-50 px-3 text-xs font-semibold text-purple-600 hover:border-purple-400 hover:bg-purple-100"
      >
        <CalendarPlus className="h-4 w-4" />
        Agendar
      </Button>
      <NewConsultationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          setIsOpen(false);
          alert("Consulta criada!");
        }}
        preselectedDate={undefined}
        preselectedTime={undefined}
        patient={patient}
      />
    </>
  );
}
export { NewConsultationModal };
