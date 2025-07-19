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
      address: "",
      notes: "",
      status: "active",
    },
  });

  const { execute, isExecuting } = useAction(upsertPatient, {
    onSuccess,
    onError: (err) => {
      setError(
        err?.error?.serverError ||
          err?.error?.validationErrors?._errors?.[0] ||
          "Erro ao cadastrar paciente",
      );
    },
  });

  async function onSubmit(data: PatientFormValues) {
    setError(null);
    execute(data);
  }

  return (
    <div className="bg-card border-border rounded-xl border shadow-xl backdrop-blur-sm transition-all duration-300">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 p-8">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
                {error}
              </div>
            )}
            <PatientFields control={form.control} />
          </div>
          <div className="border-border flex justify-end gap-4 border-t p-8 pt-8">
            <Button variant="outline" asChild className="min-w-[120px]">
              <Link href="/patients" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <Button
              type="submit"
              disabled={isExecuting}
              className="min-w-[150px]"
            >
              {isExecuting ? "Salvando..." : "Salvar Paciente"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
