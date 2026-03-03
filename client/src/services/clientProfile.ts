import axiosInstance from "../lib/axios";
import type {
  ClientProfile,
  UpdateClientProfileInput,
} from "@/types/clientProfile";

export const getMyClientProfileService = async (): Promise<ClientProfile> => {
  const res = await axiosInstance.get<ClientProfile>("/client-profiles/me");
  return res.data;
};

export const updateMyClientProfileService = async (
  data: UpdateClientProfileInput,
): Promise<ClientProfile> => {
  const res = await axiosInstance.patch<ClientProfile>(
    "/client-profiles/me",
    data,
  );
  return res.data;
};
