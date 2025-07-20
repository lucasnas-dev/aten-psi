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
    .regex(/^\d{10,11}$/, "Telefone deve ter 10 ou 11 dígitos")
    .optional()
    .or(z.literal("")),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato DD/MM/AAAA"),
  gender: z
    .enum(["male", "female", "other", "not_informed"])
    .optional()
    .or(z.literal("")),
  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF deve ter exatamente 11 dígitos")
    .optional()
    .or(z.literal("")),
  responsibleCpf: z
    .string()
    .regex(/^\d{11}$/, "CPF do responsável deve ter exatamente 11 dígitos")
    .optional()
    .or(z.literal("")),
  cep: z
    .string()
    .regex(/^\d{8}$/, "CEP deve ter exatamente 8 dígitos")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(500, "Endereço muito longo")
    .optional()
    .or(z.literal("")),
  houseNumber: z
    .string()
    .max(20, "Número muito longo")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .max(100, "Nome da cidade muito longo")
    .optional()
    .or(z.literal("")),
  state: z
    .string()
    .max(2, "Estado deve ter 2 caracteres")
    .optional()
    .or(z.literal("")),
  neighborhood: z
    .string()
    .max(100, "Nome do bairro muito longo")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      const words = val.trim().split(/\s+/);
      return words.length <= 10;
    }, "Observações devem ter no máximo 10 palavras")
    .optional()
    .or(z.literal("")),
  status: z.enum(["active", "inactive"]),
});

export type UpsertPatientInput = z.infer<typeof upsertPatientSchema>;
