"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { daysOff } from "@/db/schema";
import { tenantActionClient } from "@/lib/auth-safe-action";

const getDaysOffSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number(),
});

const toggleDayOffSchema = z.object({
  date: z.string(), // formato YYYY-MM-DD
  reason: z.string().optional(),
});

type TenantCtx = {
  user: {
    id: string;
    tenantId: string;
  };
};

export const getDaysOff = tenantActionClient
  .inputSchema(getDaysOffSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: z.infer<typeof getDaysOffSchema>;
      ctx: TenantCtx;
    }) => {
      try {
        // Buscar todos os dias sem expediente do mês
        const startDate = `${parsedInput.year}-${String(parsedInput.month).padStart(2, "0")}-01`;
        const endDate = `${parsedInput.year}-${String(parsedInput.month).padStart(2, "0")}-31`;

        const results = await db
          .select()
          .from(daysOff)
          .where(
            and(
              eq(daysOff.userId, ctx.user.id),
              eq(daysOff.tenantId, ctx.user.tenantId)
            )
          );

        // Filtrar para o mês específico
        const monthDaysOff = results.filter((d) => {
          const date = d.date;
          return date >= startDate && date <= endDate;
        });

        return {
          success: true,
          data: monthDaysOff,
        };
      } catch (error) {
        console.error("Erro ao buscar dias sem expediente:", error);
        throw new Error("Falha ao buscar dias sem expediente");
      }
    }
  );

export const toggleDayOff = tenantActionClient
  .inputSchema(toggleDayOffSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: z.infer<typeof toggleDayOffSchema>;
      ctx: TenantCtx;
    }) => {
      try {
        // Verificar se já existe
        const existing = await db
          .select()
          .from(daysOff)
          .where(
            and(
              eq(daysOff.userId, ctx.user.id),
              eq(daysOff.date, parsedInput.date)
            )
          );

        if (existing.length > 0) {
          // Remover
          await db
            .delete(daysOff)
            .where(
              and(
                eq(daysOff.userId, ctx.user.id),
                eq(daysOff.date, parsedInput.date)
              )
            );

          return {
            success: true,
            action: "removed",
            message: "Dia removido dos feriados/folgas",
          };
        } else {
          // Adicionar
          await db.insert(daysOff).values({
            userId: ctx.user.id,
            tenantId: ctx.user.tenantId,
            date: parsedInput.date,
            reason: parsedInput.reason,
          });

          return {
            success: true,
            action: "added",
            message: "Dia marcado como feriado/folga",
          };
        }
      } catch (error) {
        console.error("Erro ao alternar dia sem expediente:", error);
        throw new Error("Falha ao alternar dia sem expediente");
      }
    }
  );
