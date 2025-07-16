import { z } from "zod";

export const upsertPatientSchema = z.object({
  id: z.string().optional(), // Se vazio, cria novo; se preenchido, atualiza
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(255, "Nome muito longo"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z
    .string()
    .max(20, "Telefone muito longo")
    .optional()
    .or(z.literal("")),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
  gender: z
    .enum(["male", "female", "other", "not_informed"])
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(500, "Endereço muito longo")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(1000, "Observações muito longas")
    .optional()
    .or(z.literal("")),
  status: z.enum(["active", "inactive"]),
});

export type UpsertPatientInput = z.infer<typeof upsertPatientSchema>;
