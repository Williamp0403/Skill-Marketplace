import { z } from "zod";

export const schemaUserRole = z.object({
  role: z.enum(["CLIENT", "PROFESSIONAL"]),
  name: z.string().optional(),
  avatarUrl: z.union([z.string().url(), z.literal("")]).optional(),
});

export type TUserRole = z.infer<typeof schemaUserRole>;
