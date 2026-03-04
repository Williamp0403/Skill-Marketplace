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

export interface PublicClientProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  clientProfile: {
    companyName: string | null;
    industry: string | null;
    website: string | null;
    about: string | null;
    location: string | null;
  } | null;
  jobs: {
    id: string;
    title: string;
    budget: number;
    skills: string[];
    workModel: string | null;
    jobType: string | null;
    experienceLevel: string | null;
    location: string | null;
    createdAt: string;
    _count: {
      applications: number;
    };
  }[];
}
