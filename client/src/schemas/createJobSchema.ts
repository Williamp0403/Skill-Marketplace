import * as z from "zod";

export const createJobSchema = z
  .object({
    title: z
      .string()
      .min(5, "El título debe tener al menos 5 caracteres")
      .max(100, "El título no puede exceder los 100 caracteres"),
    description: z
      .string()
      .min(20, "La descripción debe tener al menos 20 caracteres"),
    budget: z
      .number({
        error: "Ingresa un monto válido",
      })
      .positive("El presupuesto debe ser mayor a 0"),
    workModel: z.enum(["REMOTE", "HYBRID", "ONSITE"], {
      error: "Selecciona una modalidad",
    }),
    experienceLevel: z.enum(["JUNIOR", "MID_LEVEL", "SENIOR", "EXPERT"], {
      error: "Selecciona un nivel de experiencia",
    }),
    jobType: z.enum(["FULL_TIME", "PART_TIME", "FREELANCE", "CONTRACT"], {
      error: "Selecciona un tipo de trabajo",
    }),
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

export type CreateJobFormValues = z.infer<typeof createJobSchema>;
