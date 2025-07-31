"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { consultations } from "@/db/schema";
import { tenantActionClient } from "@/lib/auth-safe-action";

import {
  CreateConsultationInput,
  createConsultationSchema,
  DeleteConsultationInput,
  deleteConsultationSchema,
  GetConsultationInput,
  getConsultationSchema,
  UpdateConsultationInput,
  updateConsultationSchema,
} from "./schema";

type TenantCtx = {
  user: {
    tenantId: string;
  };
};

// CREATE consultation
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

        revalidatePath("/agenda");
        revalidatePath("/patients");

        return {
          success: true,
          data: newConsultation,
          message: "Consulta criada com sucesso!",
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

// UPDATE consultation
export const updateConsultation = tenantActionClient
  .inputSchema(updateConsultationSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: UpdateConsultationInput;
      ctx: TenantCtx;
    }) => {
      try {
        console.log("Tentando atualizar consulta:", parsedInput.id);
        // First check if consultation exists and belongs to tenant
        const existingConsultation = await db
          .select()
          .from(consultations)
          .where(
            and(
              eq(consultations.id, parsedInput.id),
              eq(consultations.tenant_id, ctx.user.tenantId)
            )
          )
          .limit(1);

        console.log("Consulta encontrada:", existingConsultation.length > 0);

        if (existingConsultation.length === 0) {
          return {
            success: false,
            error: "Consulta não encontrada ou sem permissão para editar.",
          };
        }

        // Update consultation with only provided fields
        const updateData: Record<string, unknown> = {
          updated_at: new Date(),
        };

        if (parsedInput.data.patient_id)
          updateData.patient_id = parsedInput.data.patient_id;
        if (parsedInput.data.date) updateData.date = parsedInput.data.date;
        if (parsedInput.data.time) updateData.time = parsedInput.data.time;
        if (parsedInput.data.duration)
          updateData.duration = parsedInput.data.duration;
        if (parsedInput.data.type) updateData.type = parsedInput.data.type;
        if (parsedInput.data.modality)
          updateData.modality = parsedInput.data.modality;
        if (parsedInput.data.notes !== undefined)
          updateData.notes = parsedInput.data.notes;
        if (parsedInput.data.value !== undefined)
          updateData.value = parsedInput.data.value;
        if (parsedInput.data.status)
          updateData.status = parsedInput.data.status;

        const [updatedConsultation] = await db
          .update(consultations)
          .set(updateData)
          .where(
            and(
              eq(consultations.id, parsedInput.id),
              eq(consultations.tenant_id, ctx.user.tenantId)
            )
          )
          .returning();

        revalidatePath("/agenda");
        revalidatePath("/patients");

        return {
          success: true,
          data: updatedConsultation,
          message: "Consulta atualizada com sucesso!",
        };
      } catch (error) {
        console.error("Error updating consultation:", error);
        return {
          success: false,
          error: "Erro ao atualizar consulta. Tente novamente.",
        };
      }
    }
  );

// DELETE consultation
export const deleteConsultation = tenantActionClient
  .inputSchema(deleteConsultationSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: DeleteConsultationInput;
      ctx: TenantCtx;
    }) => {
      try {
        // First check if consultation exists and belongs to tenant
        const existingConsultation = await db
          .select()
          .from(consultations)
          .where(
            and(
              eq(consultations.id, parsedInput.id),
              eq(consultations.tenant_id, ctx.user.tenantId)
            )
          )
          .limit(1);

        if (existingConsultation.length === 0) {
          return {
            success: false,
            error: "Consulta não encontrada ou sem permissão para excluir.",
          };
        }

        const [deletedConsultation] = await db
          .delete(consultations)
          .where(
            and(
              eq(consultations.id, parsedInput.id),
              eq(consultations.tenant_id, ctx.user.tenantId)
            )
          )
          .returning();

        revalidatePath("/agenda");
        revalidatePath("/patients");

        return {
          success: true,
          data: deletedConsultation,
          message: "Consulta excluída com sucesso!",
        };
      } catch (error) {
        console.error("Error deleting consultation:", error);
        return {
          success: false,
          error: "Erro ao excluir consulta. Tente novamente.",
        };
      }
    }
  );

// GET specific consultation
export const getConsultation = tenantActionClient
  .inputSchema(getConsultationSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: GetConsultationInput;
      ctx: TenantCtx;
    }) => {
      try {
        const consultation = await db
          .select()
          .from(consultations)
          .where(
            and(
              eq(consultations.id, parsedInput.id),
              eq(consultations.tenant_id, ctx.user.tenantId)
            )
          )
          .limit(1);

        if (consultation.length === 0) {
          return {
            success: false,
            error: "Consulta não encontrada.",
          };
        }

        return {
          success: true,
          data: consultation[0],
        };
      } catch (error) {
        console.error("Error fetching consultation:", error);
        return {
          success: false,
          error: "Erro ao buscar consulta. Tente novamente.",
        };
      }
    }
  );
