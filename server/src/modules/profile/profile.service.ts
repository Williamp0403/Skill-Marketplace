import prisma from "../../lib/prisma.js";

export const getAllProfiles = async () => {
  const users = await prisma.user.findMany({
    where: {
      role: "PROFESSIONAL",
    },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      createdAt: true,
      professionalProfile: {
        select: {
          title: true,
          bio: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    title: user.professionalProfile?.title || null,
    bio: user.professionalProfile?.bio || null,
  }));
};

export const getProfileById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      role: "PROFESSIONAL",
    },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      createdAt: true,
      professionalProfile: {
        select: {
          title: true,
          bio: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    title: user.professionalProfile?.title || null,
    bio: user.professionalProfile?.bio || null,
  };
};
