"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { workingHours } from "@/db/schema";
import { tenantActionClient } from "@/lib/auth-safe-action";

const getMonthSettingsSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number(),
});

type TenantCtx = {
  user: {
    id: string;
    tenantId: string;
  };
};

export const getMonthSettings = tenantActionClient
  .inputSchema(getMonthSettingsSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: z.infer<typeof getMonthSettingsSchema>;
      ctx: TenantCtx;
    }) => {
      try {
        // Buscar horários específicos do mês
        const monthWorkingHours = await db
          .select()
          .from(workingHours)
          .where(
            and(
              eq(workingHours.userId, ctx.user.id),
              eq(workingHours.month, parsedInput.month),
              eq(workingHours.year, parsedInput.year)
            )
          );

        return {
          success: true,
          data: monthWorkingHours,
        };
      } catch (error) {
        console.error("Erro ao buscar configurações do mês:", error);
        throw new Error("Falha ao buscar configurações do mês");
      }
    }
  );
