"use client";

import { useRouter } from "next/navigation";

import { PatientForm } from "@/app/(protected)/patients/new/_components/patient-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewPatientPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Novo Paciente</h1>
          <p className="text-muted-foreground">
            Cadastre um novo paciente no sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Paciente</CardTitle>
          <CardDescription>Preencha os dados do novo paciente</CardDescription>
        </CardHeader>
        <PatientForm
          onSuccess={() => {
            router.push("/patients");
            router.refresh();
          }}
        />
      </Card>
    </div>
  );
}
