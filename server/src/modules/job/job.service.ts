import prisma from "../../lib/prisma.js";

export const getAllJobs = async () => {
  return prisma.job.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: { applications: true },
      },
    },
  });
};

export const getJobById = async (id: string) => {
  return prisma.job.findUnique({
    where: { id },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: { applications: true },
      },
    },
  });
};
