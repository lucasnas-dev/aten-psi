"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { patients } from "@/db/schema";
import { tenantActionClient } from "@/lib/auth-safe-action";

import { ArchivePatientInput, archivePatientSchema } from "./schema";

type TenantCtx = {
  user: {
    tenantId: string;
  };
};

export const archivePatient = tenantActionClient
  .inputSchema(archivePatientSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: ArchivePatientInput;
      ctx: TenantCtx;
    }) => {
      try {
        const { id, status } = parsedInput;

        // Verificar se o paciente existe e pertence ao tenant
        const existingPatient = await db.query.patients.findFirst({
          where: eq(patients.id, id),
        });

        if (!existingPatient) {
          throw new Error("Paciente não encontrado.");
        }

        if (existingPatient.tenant_id !== ctx.user.tenantId) {
          throw new Error("Acesso negado.");
        }

        // Atualizar o status do paciente
        const updatedPatient = await db
          .update(patients)
          .set({
            status,
            updated_at: new Date(),
          })
          .where(eq(patients.id, id))
          .returning();

        return {
          patient: updatedPatient[0],
          message: status === "active" ? "Paciente reativado com sucesso!" : "Paciente arquivado com sucesso!",
        };
      } catch (error) {
        console.error("Erro ao arquivar/desarquivar paciente:", error);
        throw new Error(
          error instanceof Error ? error.message : "Erro interno do servidor"
        );
      }
    }
  );
