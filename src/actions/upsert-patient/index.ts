"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { patients } from "@/db/schema";
import { tenantActionClient } from "@/lib/auth-safe-action";

import { UpsertPatientInput, upsertPatientSchema } from "./schema";

type TenantCtx = {
  user: {
    tenantId: string;
  };
};

export const upsertPatient = tenantActionClient
  .inputSchema(upsertPatientSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: UpsertPatientInput;
      ctx: TenantCtx;
    }) => {
      try {
        // Se há ID, é update; se não há, é insert
        if (parsedInput.id) {
          // Update existing patient
          await db
            .update(patients)
            .set({
              name: parsedInput.name,
              status: parsedInput.status,
              birth_date: parsedInput.birthDate,
              email: parsedInput.email,
              phone: parsedInput.phone,
              gender: parsedInput.gender,
              cpf: parsedInput.cpf,
              responsible_cpf: parsedInput.responsibleCpf,
              cep: parsedInput.cep,
              address: parsedInput.address,
              house_number: parsedInput.houseNumber,
              city: parsedInput.city,
              state: parsedInput.state,
              neighborhood: parsedInput.neighborhood,
              notes: parsedInput.notes,
              updated_at: new Date(),
            })
            .where(eq(patients.id, parsedInput.id));
        } else {
          // Insert new patient
          await db.insert(patients).values({
            name: parsedInput.name,
            status: parsedInput.status,
            birth_date: parsedInput.birthDate,
            email: parsedInput.email,
            phone: parsedInput.phone,
            gender: parsedInput.gender,
            cpf: parsedInput.cpf,
            responsible_cpf: parsedInput.responsibleCpf,
            cep: parsedInput.cep,
            address: parsedInput.address,
            house_number: parsedInput.houseNumber,
            city: parsedInput.city,
            state: parsedInput.state,
            neighborhood: parsedInput.neighborhood,
            notes: parsedInput.notes,
            tenant_id: ctx.user.tenantId,
          });
        }

        revalidatePath("/patients");
        if (parsedInput.id) {
          revalidatePath(`/patients/${parsedInput.id}`);
        }

        return { success: true };
      } catch (error) {
        console.error("Erro na action upsertPatient:", error);
        throw new Error(
          `Falha ao salvar paciente: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        );
      }
    },
  );

export type { UpsertPatientInput } from "./schema";
