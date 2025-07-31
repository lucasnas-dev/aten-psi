"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { userSettings, workingHours } from "@/db/schema";
import { tenantActionClient } from "@/lib/auth-safe-action";

import { SaveSettingsInput, saveSettingsSchema } from "./schema";

type TenantCtx = {
  user: {
    id: string;
    tenantId: string;
  };
};

export const saveSettings = tenantActionClient
  .inputSchema(saveSettingsSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: SaveSettingsInput;
      ctx: TenantCtx;
    }) => {
      try {
        const { workingHours: workingHoursData, ...settingsData } = parsedInput;

        // Salvar configurações gerais do usuário
        await db
          .insert(userSettings)
          .values({
            userId: ctx.user.id,
            tenantId: ctx.user.tenantId,
            ...settingsData,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [userSettings.userId],
            set: {
              ...settingsData,
              updatedAt: new Date(),
            },
          });

        // Limpar horários de trabalho existentes
        await db
          .delete(workingHours)
          .where(eq(workingHours.userId, ctx.user.id));

        // Salvar novos horários de trabalho
        if (workingHoursData.length > 0) {
          await db.insert(workingHours).values(
            workingHoursData.map((schedule) => ({
              userId: ctx.user.id,
              tenantId: ctx.user.tenantId,
              dayOfWeek: schedule.dayOfWeek,
              enabled: schedule.enabled,
              timeSlots: JSON.stringify(schedule.timeSlots),
              createdAt: new Date(),
              updatedAt: new Date(),
            }))
          );
        }

        return { success: true, message: "Configurações salvas com sucesso!" };
      } catch (error) {
        console.error("Erro ao salvar configurações:", error);
        throw new Error("Falha ao salvar configurações");
      }
    }
  );
