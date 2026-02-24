import { z } from "zod";

export const applyToJobSchema = z.object({
  jobId: z.string().cuid("ID de trabajo inválido"),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "El mensaje no puede exceder los 1000 caracteres"),
  proposedRate: z
    .number()
    .positive("La tarifa propuesta debe ser mayor a 0")
    .optional(),
});

export type TApplyToJob = z.infer<typeof applyToJobSchema>;
