export type InvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface Invitation {
  id: string;
  clientId: string;
  professionalId: string;
  jobId: string;
  message: string | null;
  status: InvitationStatus;
  createdAt: string;
  job: InvitationJob;
  client?: InvitationClient;
  professional?: InvitationProfessional;
}

export interface InvitationJob {
  id: string;
  title: string;
  budget: number;
  status: string;
}

export interface InvitationClient {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  clientProfile: {
    companyName: string | null;
    industry: string | null;
  } | null;
}

export interface InvitationProfessional {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  professionalProfile: {
    title: string | null;
  } | null;
}

export interface CreateInvitationInput {
  professionalId: string;
  jobId: string;
  message?: string;
}

export interface RespondInvitationInput {
  status: "ACCEPTED" | "DECLINED";
}
