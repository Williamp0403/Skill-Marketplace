import { z } from "zod";

export const updateProfessionalProfileSchema = z.object({
  title: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  hourlyRate: z.number().positive().nullable().optional(),
  experienceYears: z.number().min(0).nullable().optional(),
  location: z.string().nullable().optional(),
  availability: z.string().nullable().optional(),
  skills: z.array(z.string()).nullable().optional(),
  languages: z.array(z.string()).nullable().optional(),
  portfolio: z.array(z.string().url()).nullable().optional(),
  education: z.string().nullable().optional(),
  certifications: z.array(z.string()).nullable().optional(),
});

export type TUpdateProfessionalProfile = z.infer<
  typeof updateProfessionalProfileSchema
>;
