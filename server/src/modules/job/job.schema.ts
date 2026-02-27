import { z } from "zod";

export const jobCreateSchema = z.object({
  title: z.string().min(5, "El título es muy corto").max(100),
  description: z.string().min(20, "La descripción debe ser más detallada"),
  budget: z.number().positive("El presupuesto debe ser mayor a 0"),
  workModel: z.enum(["REMOTE", "HYBRID", "ONSITE"]).optional(),
  experienceLevel: z
    .enum(["JUNIOR", "MID_LEVEL", "SENIOR", "EXPERT"])
    .optional(),
  jobType: z
    .enum(["FULL_TIME", "PART_TIME", "FREELANCE", "CONTRACT"])
    .optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export type JobCreateInput = z.infer<typeof jobCreateSchema>;
