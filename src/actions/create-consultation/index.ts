"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { consultations } from "@/db/schema";
import { tenantActionClient } from "@/lib/auth-safe-action";

import { CreateConsultationInput, createConsultationSchema } from "./schema";

type TenantCtx = {
  user: {
    tenantId: string;
  };
};

export const createConsultation = tenantActionClient
  .inputSchema(createConsultationSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: CreateConsultationInput;
      ctx: TenantCtx;
    }) => {
      try {
        // Create new consultation
        const [newConsultation] = await db
          .insert(consultations)
          .values({
            patient_id: parsedInput.patient_id,
            date: parsedInput.date,
            time: parsedInput.time,
            duration: parsedInput.duration,
            type: parsedInput.type,
            modality: parsedInput.modality,
            notes: parsedInput.notes || null,
            value: parsedInput.value || null,
            status: parsedInput.status || "agendada",
            tenant_id: ctx.user.tenantId,
          })
          .returning();

        // Revalidate agenda page to show new consultation
        revalidatePath("/agenda");

        return {
          success: true,
          data: newConsultation,
        };
      } catch (error) {
        console.error("Error creating consultation:", error);
        return {
          success: false,
          error: "Erro ao criar consulta. Tente novamente.",
        };
      }
    }
  );
