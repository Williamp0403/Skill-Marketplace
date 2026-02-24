export interface ProfessionalProfile {
  id: string;
  userId: string;
  title: string | null;
  bio: string | null;
  hourlyRate: number | null;
  experienceYears: number | null;
  location: string | null;
  availability: string | null;
  skills: string[];
  languages: string[];
  portfolio: string[];
  education: string | null;
  certifications: string[];
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string | null;
    avatarUrl: string | null;
  };
}

export type UpdateProfessionalProfileInput = Partial<
  Omit<ProfessionalProfile, "id" | "userId" | "createdAt" | "updatedAt">
>;
