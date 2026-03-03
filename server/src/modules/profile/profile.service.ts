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
          skills: true,
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
    skills: user.professionalProfile?.skills || [],
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
          hourlyRate: true,
          experienceYears: true,
          location: true,
          availability: true,
          skills: true,
          languages: true,
          portfolio: true,
          education: true,
          certifications: true,
        },
      },
    },
  });

  if (!user) return null;

  const p = user.professionalProfile;

  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    title: p?.title || null,
    bio: p?.bio || null,
    hourlyRate: p?.hourlyRate ?? null,
    experienceYears: p?.experienceYears ?? null,
    location: p?.location || null,
    availability: p?.availability || null,
    skills: p?.skills || [],
    languages: p?.languages || [],
    portfolio: p?.portfolio || [],
    education: p?.education || null,
    certifications: p?.certifications || [],
  };
};
