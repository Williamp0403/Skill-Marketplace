import prisma from "../../lib/prisma.js";
import { TUpdateClientProfile } from "./clientProfile.schema.js";

export const getClientProfile = async (userId: string) => {
  const existingProfile = await prisma.clientProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: { avatarUrl: true, name: true },
      },
    },
  });

  if (existingProfile) return existingProfile;

  return await prisma.clientProfile.create({
    data: { userId },
    include: {
      user: {
        select: { avatarUrl: true, name: true },
      },
    },
  });
};

export const updateClientProfile = async (
  userId: string,
  data: TUpdateClientProfile,
) => {
  const profile = await prisma.clientProfile.update({
    where: {
      userId,
    },
    data,
    include: {
      user: {
        select: { avatarUrl: true, name: true },
      },
    },
  });

  return profile;
};
