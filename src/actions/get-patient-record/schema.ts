import { z } from "zod";

export const getPatientRecordSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
});

export type GetPatientRecordInput = z.infer<typeof getPatientRecordSchema>;
