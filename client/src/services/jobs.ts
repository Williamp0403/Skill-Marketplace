import axiosInstance from "@/lib/axios";
import type {
  Job,
  JobFilters,
  JobCreateInput,
  ClientDashboardStats,
  DashboardRecentActivity,
} from "@/types/job";

export async function getJobsService(filters?: JobFilters): Promise<Job[]> {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.workModel) params.append("workModel", filters.workModel);
  if (filters?.experienceLevel)
    params.append("experienceLevel", filters.experienceLevel);
  if (filters?.jobType) params.append("jobType", filters.jobType);

  const res = await axiosInstance.get<Job[]>(`/jobs?${params.toString()}`);
  return res.data;
}

export const getJobById = async (id: string): Promise<Job> => {
  const { data } = await axiosInstance.get<Job>(`/jobs/${id}`);
  return data;
};

export const createJobService = async (data: JobCreateInput): Promise<Job> => {
  const res = await axiosInstance.post<Job>("/jobs", data);
  return res.data;
};

export const getClientJobsService = async (): Promise<Job[]> => {
  const res = await axiosInstance.get<Job[]>("/jobs/me");
  return res.data;
};

export const getClientDashboardStatsService =
  async (): Promise<ClientDashboardStats> => {
    const res = await axiosInstance.get<ClientDashboardStats>("/jobs/me/stats");
    return res.data;
  };

export const getClientRecentActivityService = async (): Promise<
  DashboardRecentActivity[]
> => {
  const res = await axiosInstance.get<DashboardRecentActivity[]>(
    "/jobs/me/recent-activity",
  );
  return res.data;
};
