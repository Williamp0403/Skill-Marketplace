import axiosInstance from "@/lib/axios";
import type { Job, JobFilters } from "@/types/job";

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
