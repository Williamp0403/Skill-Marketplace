export interface Profile {
  id: string;
  name: string;
  avatarUrl: string | null;
  createdAt: Date;
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
}
