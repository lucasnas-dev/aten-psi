import { z } from "zod";

export const workingHoursSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  enabled: z.boolean(),
  timeSlots: z.array(
    z.object({
      start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    })
  ),
});

export const saveSettingsSchema = z.object({
  // Informações profissionais
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  crp: z.string().optional(),
  specialization: z.string().optional(),

  // Configurações de consulta
  defaultDuration: z.number().min(15).max(240),
  bufferTime: z.number().min(0).max(60),
  maxAdvanceBooking: z.number().min(1).max(365),
  allowSameDayBooking: z.boolean(),

  // Horários de trabalho
  workingHours: z.array(workingHoursSchema),

  // Configurações de notificação
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  reminderTime: z.number().min(15).max(1440),

  // Configurações de sistema
  weekStartsOn: z.enum(["0", "1"]),
  timeFormat: z.enum(["12", "24"]),
  timezone: z.string(),
});

export type SaveSettingsInput = z.infer<typeof saveSettingsSchema>;
