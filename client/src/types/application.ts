export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface ProfessionalApplicationJobClient {
  name: string | null;
  avatarUrl: string | null;
}

export interface ProfessionalApplicationJob {
  id: string;
  title: string;
  description: string;
  budget: number;
  clientId: string;
  createdAt: string;
  client: ProfessionalApplicationJobClient;
}

export interface Application {
  id: string;
  message: string;
  proposedRate: number | null;
  status: ApplicationStatus;
  professionalId: string;
  jobId: string;
  createdAt: string;
  job: ProfessionalApplicationJob;
}
