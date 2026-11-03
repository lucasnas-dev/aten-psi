"use server";

import { and, eq } from "drizzle-orm";
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
              social_name: parsedInput.useSocialName
                ? parsedInput.socialName || null
                : null,
              status: parsedInput.status,
              birth_date: parsedInput.birthDate || "",
              email: parsedInput.email,
              phone: parsedInput.phone,
              gender: parsedInput.gender,
              cpf: parsedInput.cpf,
              responsible_cpf: parsedInput.responsibleCpf,
              responsible_name:
                parsedInput.responsibleName === undefined
                  ? undefined
                  : parsedInput.responsibleName.trim() || null,
              emergency_contact_name:
                parsedInput.emergencyContactName === undefined
                  ? undefined
                  : parsedInput.emergencyContactName.trim() || null,
              emergency_contact_phone:
                parsedInput.emergencyContactPhone === undefined
                  ? undefined
                  : parsedInput.emergencyContactPhone || null,
              cep: parsedInput.cep,
              address: parsedInput.address,
              house_number: parsedInput.houseNumber,
              city: parsedInput.city,
              state: parsedInput.state,
              neighborhood: parsedInput.neighborhood,
              notes: parsedInput.notes,
              updated_at: new Date(),
            })
            .where(
              and(
                eq(patients.id, parsedInput.id),
                eq(patients.tenant_id, ctx.user.tenantId)
              )
            );
        } else {
          // Insert new patient
          await db.insert(patients).values({
            name: parsedInput.name,
            social_name: parsedInput.useSocialName
              ? parsedInput.socialName || null
              : null,
            status: parsedInput.status,
            birth_date: parsedInput.birthDate || "",
            email: parsedInput.email,
            phone: parsedInput.phone,
            gender: parsedInput.gender,
            cpf: parsedInput.cpf,
            responsible_cpf: parsedInput.responsibleCpf,
            responsible_name: parsedInput.responsibleName?.trim() || null,
            emergency_contact_name:
              parsedInput.emergencyContactName?.trim() || null,
            emergency_contact_phone: parsedInput.emergencyContactPhone || null,
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
          revalidatePath(`/patients/${parsedInput.id}/psychological-record`);
        }

        return { success: true };
      } catch (error) {
        console.error("Erro na action upsertPatient:", error);
        throw new Error(
          `Falha ao salvar paciente: ${error instanceof Error ? error.message : "Erro desconhecido"}`
        );
      }
    }
  );

export type { UpsertPatientInput } from "./schema";
