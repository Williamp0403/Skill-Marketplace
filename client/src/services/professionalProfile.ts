import axiosInstance from "@/lib/axios";
import type {
  ProfessionalProfile,
  UpdateProfessionalProfileInput,
} from "@/types/professionalProfile";

export async function getMyProfessionalProfile(): Promise<ProfessionalProfile> {
  const res = await axiosInstance.get<ProfessionalProfile>(
    "/professional-profiles/me",
  );
  return res.data;
}

export async function updateMyProfessionalProfile(
  data: UpdateProfessionalProfileInput,
): Promise<ProfessionalProfile> {
  const res = await axiosInstance.patch<ProfessionalProfile>(
    "/professional-profiles/me",
    data,
  );
  return res.data;
}
