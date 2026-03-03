export interface ClientProfile {
  id: string;
  userId: string;
  companyName: string | null;
  industry: string | null;
  website: string | null;
  about: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateClientProfileInput {
  companyName: string | null;
  industry: string | null;
  website: string | null;
  about: string | null;
  location: string | null;
}
