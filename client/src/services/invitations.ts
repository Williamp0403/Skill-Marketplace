import axiosInstance from "@/lib/axios";
import type { Invitation, CreateInvitationInput, RespondInvitationInput } from "@/types/invitation";

export async function createInvitationService(data: CreateInvitationInput): Promise<Invitation> {
  const res = await axiosInstance.post<Invitation>("/invitations", data);
  return res.data;
}

export async function getMyInvitationsService(): Promise<Invitation[]> {
  const res = await axiosInstance.get<Invitation[]>("/invitations/me");
  return res.data;
}

export async function respondToInvitationService(
  invitationId: string,
  data: RespondInvitationInput,
): Promise<Invitation> {
  const res = await axiosInstance.patch<Invitation>(`/invitations/${invitationId}`, data);
  return res.data;
}
