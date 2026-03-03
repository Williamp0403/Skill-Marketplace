import { z } from "zod";

export const clientProfileSchema = z.object({
  companyName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .or(z.literal(""))
    .nullable(),
  industry: z.string().or(z.literal("")).nullable(),
  website: z
    .string()
    .url("Debe ser una URL válida, ej: https://empresa.com")
    .or(z.literal(""))
    .nullable(),
  about: z.string().or(z.literal("")).nullable(),
  location: z.string().or(z.literal("")).nullable(),
});

export type ClientProfileFormValues = z.infer<typeof clientProfileSchema>;
