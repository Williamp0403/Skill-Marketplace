import prisma from "../../lib/prisma.js";
import { JobCreateInput } from "./job.schema.js";

export const getAllJobs = async (filters: {
  search?: string;
  workModel?: string;
  experienceLevel?: string;
  jobType?: string;
}) => {
  const { search, workModel, experienceLevel, jobType } = filters;

  const where: any = {
    AND: [],
  };

  if (search) {
    // Generate case variants for skills matching (Prisma arrays don't support insensitive mode)
    const skillVariants = [
      search,
      search.toLowerCase(),
      search.toUpperCase(),
      search.charAt(0).toUpperCase() + search.slice(1).toLowerCase(),
    ];

    where.AND.push({
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
        { skills: { hasSome: skillVariants } },
        { location: { contains: search, mode: "insensitive" as const } },
      ],
    });
  }

  if (workModel) where.AND.push({ workModel });
  if (experienceLevel) where.AND.push({ experienceLevel });
  if (jobType) where.AND.push({ jobType });

  return prisma.job.findMany({
    where: where.AND.length > 0 ? where : {},
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

export const createJob = async (clientId: string, data: JobCreateInput) => {
  return prisma.job.create({
    data: {
      ...data,
      clientId,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};
