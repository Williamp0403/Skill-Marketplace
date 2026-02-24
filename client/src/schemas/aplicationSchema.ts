import * as z from "zod";

export const applyJobSchema = z.object({
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "El mensaje no puede exceder los 1000 caracteres"),
  proposedRate: z.number().positive("La tarifa debe ser mayor a 0").optional(),
});

export type ApplyJobFormValues = z.infer<typeof applyJobSchema>;
