import axiosInstance from "@/lib/axios";
import type { Profile } from "@/types/profile";

export async function getProfilesService(): Promise<Profile[]> {
  const res = await axiosInstance.get<Profile[]>("/profiles");
  return res.data;
}

export async function getProfileById(id: string): Promise<Profile> {
  const res = await axiosInstance.get<Profile>(`/profiles/${id}`);
  return res.data;
}
