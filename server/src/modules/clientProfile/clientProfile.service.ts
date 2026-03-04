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

export const getPublicClientProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, role: "CLIENT" },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      createdAt: true,
      clientProfile: {
        select: {
          companyName: true,
          industry: true,
          website: true,
          about: true,
          location: true,
        },
      },
      jobs: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          budget: true,
          skills: true,
          workModel: true,
          jobType: true,
          experienceLevel: true,
          location: true,
          createdAt: true,
          _count: {
            select: { applications: true },
          },
        },
      },
    },
  });

  return user;
};
