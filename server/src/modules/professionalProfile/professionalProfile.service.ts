import prisma from "../../lib/prisma.js";

export const createProfessionalProfileIfNotExists = async (userId: string) => {
  const existing = await prisma.professionalProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: { avatarUrl: true, name: true },
      },
    },
  });

  if (existing) return existing;

  return prisma.professionalProfile.create({
    data: { userId },
    include: {
      user: {
        select: { avatarUrl: true, name: true },
      },
    },
  });
};

export const updateProfessionalProfile = async (userId: string, data: any) => {
  return prisma.professionalProfile.update({
    where: { userId },
    data,
    include: {
      user: {
        select: { avatarUrl: true, name: true },
      },
    },
  });
};
