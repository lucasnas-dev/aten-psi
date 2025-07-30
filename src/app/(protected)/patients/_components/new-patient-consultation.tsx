import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NewConsultationModal } from "../../agenda/_components";
import { Patient } from "./types";

export function NewPatientConsultation({ patient }: { patient: Patient }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="default" onClick={() => setIsOpen(true)}>
        Nova Consulta
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
