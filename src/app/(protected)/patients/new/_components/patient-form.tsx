"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { upsertPatient } from "@/actions/upsert-patient";
import { upsertPatientSchema } from "@/actions/upsert-patient/schema";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
              {error}
            </div>
          )}
          <PatientFields control={form.control} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => form.reset()}
            disabled={isExecuting}
          >
            Limpar
          </Button>
          <Button type="submit" disabled={isExecuting}>
            {isExecuting ? "Salvando..." : "Salvar Paciente"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
