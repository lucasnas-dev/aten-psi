import * as z from "zod";

// Schema for getting psychological records
export const getPsychologicalRecordsSchema = z.object({
  search: z.string().optional(),
  status: z
    .enum(["all", "active", "completed", "suspended", "archived"])
    .optional()
    .default("all"),
  sector: z.string().optional(),
  page: z.number().positive().optional().default(1),
  limit: z.number().positive().max(100).optional().default(20),
  orderBy: z
    .enum(["code", "patient_name", "start_date", "status"])
    .optional()
    .default("code"),
  orderDirection: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Schema for generating archival code
export const generateArchivalCodeSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  year: z.number().positive(),
  recordNumber: z.number().positive(),
  sector: z.string().min(1).max(1),
  cabinet: z.string().min(1).max(2),
  shelf: z.string().min(1).max(1),
});

// Schema for archiving psychological record
export const archivePsychologicalRecordSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  archivalCode: z.string().min(1, "Archival code is required"),
  sector: z.string().min(1).max(1),
  shelf: z.string().min(1).max(1),
  position: z.string().min(1).max(3),
  notes: z.string().optional(),
});

// Schema for updating psychological record status
export const updateRecordStatusSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  status: z.enum(["active", "completed", "suspended", "archived"]),
  archivalCode: z.string().optional(),
  sector: z.string().optional(),
  shelf: z.string().optional(),
  position: z.string().optional(),
  notes: z.string().optional(),
});

// Type exports
export type GetPsychologicalRecordsInput = z.infer<
  typeof getPsychologicalRecordsSchema
>;
export type GenerateArchivalCodeInput = z.infer<
  typeof generateArchivalCodeSchema
>;
export type ArchivePsychologicalRecordInput = z.infer<
  typeof archivePsychologicalRecordSchema
>;
export type UpdateRecordStatusInput = z.infer<typeof updateRecordStatusSchema>;
