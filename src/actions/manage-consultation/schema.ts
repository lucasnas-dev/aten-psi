import { z } from "zod";

// Base schema for consultation data
const consultationDataSchema = z.object({
  patient_id: z.string().min(1, "Paciente é obrigatório"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Horário deve estar no formato HH:MM"),
  duration: z
    .string()
    .min(1, "Duração é obrigatória")
    .regex(/^\d+$/, "Duração deve ser um número"),
  type: z.enum(
    [
      "triagem",
      "avaliacao_inicial",
      "atendimento",
      "avaliacao_psicologica",
      "devolutiva",
    ],
    {
      errorMap: () => ({ message: "Tipo de consulta inválido" }),
    }
  ),
  modality: z.enum(["presencial", "online"], {
    errorMap: () => ({ message: "Modalidade inválida" }),
  }),
  notes: z.string().optional(),
  value: z.string().optional(),
  status: z
    .enum([
      "agendada",
      "confirmada",
      "em_andamento",
      "concluida",
      "cancelada",
      "faltou",
    ])
    .optional()
    .default("agendada"),
});

// Schema for creating a new consultation
export const createConsultationSchema = consultationDataSchema;

// Schema for updating an existing consultation
export const updateConsultationSchema = z.object({
  id: z.string().min(1, "ID da consulta é obrigatório"),
  data: consultationDataSchema.partial(), // All fields are optional for updates
});

// Schema for deleting a consultation
export const deleteConsultationSchema = z.object({
  id: z.string().min(1, "ID da consulta é obrigatório"),
});

// Schema for getting a specific consultation
export const getConsultationSchema = z.object({
  id: z.string().min(1, "ID da consulta é obrigatório"),
});

// Type exports
export type CreateConsultationInput = z.infer<typeof createConsultationSchema>;
export type UpdateConsultationInput = z.infer<typeof updateConsultationSchema>;
export type DeleteConsultationInput = z.infer<typeof deleteConsultationSchema>;
export type GetConsultationInput = z.infer<typeof getConsultationSchema>;
