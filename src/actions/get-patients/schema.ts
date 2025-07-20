import { z } from "zod";

export const getPatientsSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["all", "active", "inactive"]).default("all"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export type GetPatientsInput = z.infer<typeof getPatientsSchema>;
