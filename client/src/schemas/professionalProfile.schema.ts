import { z } from "zod";

export const professionalProfileSchema = z.object({
  title: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  // Usamos z.any().transform() para evitar problemas de inferencia con RHF y NaN
  hourlyRate: z
    .any()
    .transform((v) =>
      v === "" || v === null || v === undefined || isNaN(Number(v))
        ? null
        : Number(v),
    )
    .pipe(z.number().positive("Debe ser mayor a 0").nullable()),

  experienceYears: z
    .any()
    .transform((v) =>
      v === "" || v === null || v === undefined || isNaN(Number(v))
        ? null
        : Number(v),
    )
    .pipe(z.number().min(0, "No puede ser negativo").nullable()),

  location: z.string().nullable().optional(),
  availability: z.string().nullable().optional(),
  skills: z.string().nullable().optional(),
  languages: z.string().nullable().optional(),
  portfolio: z.string().nullable().optional(),
  education: z.string().nullable().optional(),
});

export type ProfessionalProfileFormValues = z.infer<
  typeof professionalProfileSchema
>;
