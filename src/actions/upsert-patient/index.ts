"use server";

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
      await db
        .insert(patients)
        .values({
          // Map camelCase to snake_case as expected by the DB schema
          ...(parsedInput.id ? { id: parsedInput.id } : {}),
          name: parsedInput.name,
          status: parsedInput.status,
          birth_date: parsedInput.birthDate,
          email: parsedInput.email,
          phone: parsedInput.phone,
          gender: parsedInput.gender,
          address: parsedInput.address,
          notes: parsedInput.notes,
          tenant_id: ctx.user.tenantId, // <-- snake_case para o banco!
        })
        .onConflictDoUpdate({
          target: [patients.id],
          set: {
            name: parsedInput.name,
            status: parsedInput.status,
            birth_date: parsedInput.birthDate,
            email: parsedInput.email,
            phone: parsedInput.phone,
            gender: parsedInput.gender,
            address: parsedInput.address,
            notes: parsedInput.notes,
            tenant_id: ctx.user.tenantId, // <-- snake_case para o banco!
            updated_at: new Date(), // <-- snake_case para o banco!
          },
        });

      revalidatePath("/patients");
      if (parsedInput.id) {
        revalidatePath(`/patients/${parsedInput.id}`);
      }

      return { success: true };
    },
  );

export type { UpsertPatientInput } from "./schema";
