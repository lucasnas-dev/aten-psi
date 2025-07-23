import { z } from "zod";

export const archivePatientSchema = z.object({
  id: z.string(),
  status: z.enum(["active", "inactive"]),
});

export type ArchivePatientInput = z.infer<typeof archivePatientSchema>;
