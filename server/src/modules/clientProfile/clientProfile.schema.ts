import { z } from "zod";

export const updateClientProfileSchema = z.object({
  companyName: z.string().min(2, "Company name is too short").nullable(),
  industry: z.string().nullable(),
  website: z.string().url("Must be a valid URL").or(z.literal("")).nullable(),
  about: z.string().nullable(),
  location: z.string().nullable(),
});

export type TUpdateClientProfile = z.infer<typeof updateClientProfileSchema>;
