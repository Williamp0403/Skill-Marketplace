import { z } from "zod";

export const createInvitationSchema = z.object({
  professionalId: z.string().cuid("ID de profesional inválido"),
  jobId: z.string().cuid("ID de trabajo inválido"),
  message: z.string().max(1000, "El mensaje no puede exceder los 1000 caracteres").optional(),
});

export const respondInvitationSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED"]),
});

export type TCreateInvitation = z.infer<typeof createInvitationSchema>;
