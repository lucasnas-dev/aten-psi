"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { upsertPatient } from "@/actions/upsert-patient";
import { upsertPatientSchema } from "@/actions/upsert-patient/schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { PatientFields } from "./patient-fields";

type PatientFormValues = z.infer<typeof upsertPatientSchema>;

export function PatientForm({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(upsertPatientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthDate: "",
      gender: "",
      cpf: "",
      responsibleCpf: "",
      cep: "",
      address: "",
      houseNumber: "",
      city: "",
      state: "",
      neighborhood: "",
      notes: "",
      status: "active",
    },
  });

  const { execute, isExecuting } = useAction(upsertPatient, {
    onSuccess,
    onError: (err) => {
      console.error("Erro detalhado:", err);
      setError(
        err?.error?.serverError ||
          err?.error?.validationErrors?._errors?.[0] ||
          "Erro ao cadastrar paciente"
      );
    },
  });

  async function onSubmit(data: PatientFormValues) {
    setError(null);
    console.log("Dados sendo enviados:", data);
    execute(data);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1 p-3">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                {error}
              </div>
            )}
            <PatientFields control={form.control} />

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" asChild className="min-w-[100px]">
                <Link href="/patients" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Link>
              </Button>
              <Button
                type="submit"
                variant="outline"
                disabled={isExecuting}
                className="min-w-[130px]"
              >
                {isExecuting ? "Salvando..." : "Salvar Paciente"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
