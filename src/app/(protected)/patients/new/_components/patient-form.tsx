"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { upsertPatient } from "@/actions/upsert-patient";
import { upsertPatientSchema } from "@/actions/upsert-patient/schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { PatientFields } from "./patient-fields";

type PatientFormValues = z.infer<typeof upsertPatientSchema>;

type InitialPatient = {
  id: string;
  name: string;
  social_name: string | null;
  email: string | null;
  phone: string | null;
  birth_date: string;
  gender: string | null;
  cpf: string | null;
  responsible_cpf: string | null;
  responsible_name: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  cep: string | null;
  address: string | null;
  house_number: string | null;
  city: string | null;
  state: string | null;
  neighborhood: string | null;
  notes: string | null;
  status: string;
};

export function PatientForm({
  initialPatient,
}: {
  initialPatient?: InitialPatient;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(upsertPatientSchema),
    defaultValues: {
      name: "",
      useSocialName: false,
      socialName: "",
      email: "",
      phone: "",
      birthDate: "",
      gender: "",
      cpf: "",
      responsibleCpf: "",
      responsibleName: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
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

  useEffect(() => {
    if (!initialPatient) return;

    form.reset({
      id: initialPatient.id,
      name: initialPatient.name,
      useSocialName: Boolean(initialPatient.social_name?.trim()),
      socialName: initialPatient.social_name || "",
      email: initialPatient.email || "",
      phone: initialPatient.phone || "",
      birthDate: initialPatient.birth_date,
      gender:
        initialPatient.gender === "male" ||
        initialPatient.gender === "female" ||
        initialPatient.gender === "other" ||
        initialPatient.gender === "not_informed"
          ? initialPatient.gender
          : "",
      cpf: initialPatient.cpf || "",
      responsibleCpf: initialPatient.responsible_cpf || "",
      responsibleName: initialPatient.responsible_name || "",
      emergencyContactName: initialPatient.emergency_contact_name || "",
      emergencyContactPhone: initialPatient.emergency_contact_phone || "",
      cep: initialPatient.cep || "",
      address: initialPatient.address || "",
      houseNumber: initialPatient.house_number || "",
      city: initialPatient.city || "",
      state: initialPatient.state || "",
      neighborhood: initialPatient.neighborhood || "",
      notes: initialPatient.notes || "",
      status: initialPatient.status === "inactive" ? "inactive" : "active",
    });
  }, [form, initialPatient]);

  const { execute, isExecuting } = useAction(upsertPatient, {
    onSuccess: () => {
      router.push("/patients");
      router.refresh();
    },
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
    execute(data);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
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
