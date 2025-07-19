"use client";

import { useRouter } from "next/navigation";

import { PatientForm } from "@/app/(protected)/patients/new/_components/patient-form";

export default function NewPatientPage() {
  const router = useRouter();

  return (
    <div className="space-y-8 p-6">
      {/* Formulário direto */}
      <PatientForm
        onSuccess={() => {
          router.push("/patients");
          router.refresh();
        }}
      />
    </div>
  );
}
