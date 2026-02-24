import axiosInstance from "@/lib/axios";
import type { Job } from "@/types/job";

export async function getJobsService(): Promise<Job[]> {
  const res = await axiosInstance.get<Job[]>("/jobs");
  return res.data;
}

export const getJobById = async (id: string): Promise<Job> => {
  const { data } = await axiosInstance.get<Job>(`/jobs/${id}`);
  return data;
};
