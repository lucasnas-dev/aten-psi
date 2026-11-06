"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { tenantActionClient } from "@/lib/auth-safe-action";

import { issueDeclarationSchema } from "./schema";
import { issueDeclarationForPatient } from "./service";

export const issueDeclaration = tenantActionClient
  .inputSchema(issueDeclarationSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const result = await issueDeclarationForPatient(
        db,
        parsedInput,
        ctx.user
      );
      if (result.success) {
        revalidatePath(
          `/patients/${parsedInput.patientId}/psychological-record`
        );
      }
      return result;
    } catch (error) {
      // Não registrar o payload clínico nem os parâmetros da consulta nos logs.
      console.error(
        "Falha ao registrar declaração:",
        error instanceof Error ? error.name : "UnknownError"
      );
      return {
        success: false,
        error:
          "Não foi possível salvar a declaração. Nenhuma emissão foi confirmada.",
      } as const;
    }
  });
