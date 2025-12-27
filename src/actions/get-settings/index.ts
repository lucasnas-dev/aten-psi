"use server";

import { and, eq, isNull, or } from "drizzle-orm";

import { db } from "@/db";
import { userSettings, workingHours } from "@/db/schema";
import { tenantActionClient } from "@/lib/auth-safe-action";

type TenantCtx = {
  user: {
    id: string;
    tenantId: string;
  };
};

export const getSettings = tenantActionClient.action(
  async ({ ctx }: { ctx: TenantCtx }) => {
    try {
      // Buscar configurações do usuário
      const settings = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, ctx.user.id))
        .limit(1);

      // Buscar horários de trabalho padrão (month e year null)
      const workingHoursData = await db
        .select()
        .from(workingHours)
        .where(
          and(
            eq(workingHours.userId, ctx.user.id),
            isNull(workingHours.month),
            isNull(workingHours.year)
          )
        );

      return {
        success: true,
        data: {
          settings: settings[0] || null,
          workingHours: workingHoursData || [],
        },
      };
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      throw new Error("Falha ao buscar configurações");
    }
  }
);
