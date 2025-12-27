"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { workingHours } from "@/db/schema";
import { tenantActionClient } from "@/lib/auth-safe-action";

const saveMonthSettingsSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number(),
  workingHours: z.array(
    z.object({
      dayOfWeek: z.number(),
      enabled: z.boolean(),
      timeSlots: z.array(
        z.object({
          start: z.string(),
          end: z.string(),
        })
      ),
    })
  ),
});

type TenantCtx = {
  user: {
    id: string;
    tenantId: string;
  };
};

export const saveMonthSettings = tenantActionClient
  .inputSchema(saveMonthSettingsSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: z.infer<typeof saveMonthSettingsSchema>;
      ctx: TenantCtx;
    }) => {
      try {
        // Deletar configurações antigas do mês
        await db
          .delete(workingHours)
          .where(
            and(
              eq(workingHours.userId, ctx.user.id),
              eq(workingHours.month, parsedInput.month),
              eq(workingHours.year, parsedInput.year)
            )
          );

        // Inserir novas configurações
        const values = parsedInput.workingHours.map((wh) => ({
          userId: ctx.user.id,
          tenantId: ctx.user.tenantId,
          month: parsedInput.month,
          year: parsedInput.year,
          dayOfWeek: wh.dayOfWeek,
          enabled: wh.enabled,
          timeSlots: wh.timeSlots,
        }));

        if (values.length > 0) {
          await db.insert(workingHours).values(values);
        }

        return {
          success: true,
          message: "Configurações do mês salvas com sucesso",
        };
      } catch (error) {
        console.error("Erro ao salvar configurações do mês:", error);
        throw new Error("Falha ao salvar configurações do mês");
      }
    }
  );
