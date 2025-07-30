import { z } from "zod";

export const getConsultationsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type GetConsultationsInput = z.infer<typeof getConsultationsSchema>;
