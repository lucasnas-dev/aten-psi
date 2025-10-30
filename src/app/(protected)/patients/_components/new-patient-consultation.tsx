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
        className="h-8 gap-2 px-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >
        <CalendarPlus className="h-4 w-4 text-purple-600" />
        <span className="text-xs font-medium text-purple-600">Agendar</span>
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
