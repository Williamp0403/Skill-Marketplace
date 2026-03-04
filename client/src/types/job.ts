export interface JobClient {
  id: string;
  name: string;
  avatarUrl: string | null;
  clientProfile: {
    companyName: string | null;
    industry: string | null;
    website: string | null;
    about: string | null;
    location: string | null;
  } | null;
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

export interface JobCreateInput {
  title: string;
  description: string;
  budget: number;
  workModel: "REMOTE" | "HYBRID" | "ONSITE";
  experienceLevel: "JUNIOR" | "MID_LEVEL" | "SENIOR" | "EXPERT";
  jobType: "FULL_TIME" | "PART_TIME" | "FREELANCE" | "CONTRACT";
  location?: string;
  skills?: string[];
}

export interface ClientDashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pending: number;
  accepted: number;
  rejected: number;
}

export interface DashboardRecentActivity {
  id: string;
  message: string;
  proposedRate: number;
  status: string;
  professionalId: string;
  jobId: string;
  createdAt: string;
  professional: {
    name: string | null;
    avatarUrl: string | null;
  };
  job: {
    title: string;
    id: string;
  };
}
