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

  return await prisma.job.findMany({
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
  return await prisma.job.findUnique({
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
  return await prisma.job.create({
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

export const getJobsByClient = async (clientId: string) => {
  return await prisma.job.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });
};

export const getClientDashboardStats = async (clientId: string) => {
  const jobs = await prisma.job.findMany({
    where: { clientId },
    select: {
      id: true,
      applications: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  const totalJobs = jobs.length;
  // All jobs are considered active until a status feature is added
  const activeJobs = totalJobs;

  let totalApplications = 0;
  let pending = 0;
  let accepted = 0;
  let rejected = 0;

  for (const job of jobs) {
    totalApplications += job.applications.length;
    for (const app of job.applications) {
      if (app.status === "PENDING") pending++;
      else if (app.status === "ACCEPTED") accepted++;
      else if (app.status === "REJECTED") rejected++;
    }
  }

  return {
    totalJobs,
    activeJobs,
    totalApplications,
    pending,
    accepted,
    rejected,
  };
};

export const getClientRecentActivity = async (clientId: string) => {
  return await prisma.application.findMany({
    where: {
      job: {
        clientId: clientId,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      professional: {
        select: {
          name: true,
          avatarUrl: true,
        },
      },
      job: {
        select: {
          title: true,
          id: true,
        },
      },
    },
  });
};
