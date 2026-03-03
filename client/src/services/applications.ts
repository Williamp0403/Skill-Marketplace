import axiosInstance from "@/lib/axios";
import type {
  Application,
  ApplicationStats,
  ClientJobApplication,
} from "@/types/application";

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

export async function getMyStatsService(): Promise<ApplicationStats> {
  const res = await axiosInstance.get<ApplicationStats>(
    "/applications/me/stats",
  );
  return res.data;
}

export async function getApplicationsForJobService(
  jobId: string,
): Promise<ClientJobApplication[]> {
  const res = await axiosInstance.get<ClientJobApplication[]>(
    `/applications/job/${jobId}`,
  );
  return res.data;
}

export async function updateApplicationStatusService(
  applicationId: string,
  status: "ACCEPTED" | "REJECTED",
): Promise<ClientJobApplication> {
  const res = await axiosInstance.patch<ClientJobApplication>(
    `/applications/${applicationId}/status`,
    { status },
  );
  return res.data;
}
