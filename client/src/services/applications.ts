import axiosInstance from "@/lib/axios";
import type { Application } from "@/types/application";

export async function getMyApplicationsService(): Promise<Application[]> {
  const res = await axiosInstance.get<Application[]>("/applications/me");
  return res.data;
}

export async function applyToJobService(data: {
  jobId: string;
  message: string;
  proposedRate?: number;
}): Promise<Application> {
  const res = await axiosInstance.post<Application>("/applications", data);
  return res.data;
}
