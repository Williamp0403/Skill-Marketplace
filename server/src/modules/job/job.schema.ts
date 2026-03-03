import { z } from "zod";

export const jobCreateSchema = z
  .object({
    title: z.string().min(5, "El título es muy corto").max(100),
    description: z.string().min(20, "La descripción debe ser más detallada"),
    budget: z.number().positive("El presupuesto debe ser mayor a 0"),
    workModel: z.enum(["REMOTE", "HYBRID", "ONSITE"]),
    experienceLevel: z.enum(["JUNIOR", "MID_LEVEL", "SENIOR", "EXPERT"]),
    jobType: z.enum(["FULL_TIME", "PART_TIME", "FREELANCE", "CONTRACT"]),
    location: z.string().optional(),
    skills: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.workModel === "HYBRID" || data.workModel === "ONSITE") {
        return !!data.location && data.location.trim().length > 0;
      }
      return true;
    },
    {
      message:
        "La ubicación es obligatoria para trabajos híbridos o presenciales",
      path: ["location"],
    },
  );

export type JobCreateInput = z.infer<typeof jobCreateSchema>;
