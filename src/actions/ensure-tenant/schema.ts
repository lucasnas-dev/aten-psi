import { z } from "zod";

export const createTenantSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  plan: z.string().default("free"),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
