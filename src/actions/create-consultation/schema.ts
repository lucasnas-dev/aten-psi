import { z } from "zod";

export const createConsultationSchema = z.object({
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
  type: z.enum([
    "triagem",
    "avaliacao_inicial", 
    "atendimento",
    "avaliacao_psicologica",
    "devolutiva"
  ], {
    errorMap: () => ({ message: "Tipo de consulta inválido" })
  }),
  modality: z.enum([
    "presencial",
    "online"
  ], {
    errorMap: () => ({ message: "Modalidade inválida" })
  }),
  notes: z.string().optional(),
  value: z.string().optional(),
  status: z.enum([
    "agendada",
    "confirmada", 
    "em_andamento",
    "concluida",
    "cancelada",
    "faltou"
  ]).optional().default("agendada"),
});

export type CreateConsultationInput = z.infer<typeof createConsultationSchema>;
