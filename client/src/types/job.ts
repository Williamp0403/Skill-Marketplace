export interface JobClient {
  id: string;
  name: string;
  title: string;
}

export interface JobApplicationCount {
  applications: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  workModel?: "REMOTE" | "HYBRID" | "ONSITE";
  experienceLevel?: "JUNIOR" | "MID_LEVEL" | "SENIOR" | "EXPERT";
  jobType?: "FULL_TIME" | "PART_TIME" | "FREELANCE" | "CONTRACT";
  location?: string | null;
  skills?: string[];
  clientId: string;
  createdAt: string;
  client: JobClient;
  _count: JobApplicationCount;
}

export interface JobFilters {
  search?: string;
  workModel?: string;
  experienceLevel?: string;
  jobType?: string;
}
