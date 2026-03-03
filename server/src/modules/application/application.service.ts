import prisma from "../../lib/prisma.js";

export const createApplication = async (
  professionalId: string,
  jobId: string,
  message: string,
  proposedRate?: number,
) => {
  // Check if job exists
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    return { error: "Job not found", status: 404 };
  }

  // Check if application already exists
  const existingApplication = await prisma.application.findUnique({
    where: {
      professionalId_jobId: {
        professionalId,
        jobId,
      },
    },
  });

  if (existingApplication) {
    return { error: "You have already applied to this job", status: 409 };
  }

  return prisma.application.create({
    data: {
      professionalId,
      jobId,
      message,
      proposedRate,
    },
    include: {
      job: true,
    },
  });
};

export const getProfessionalApplications = async (professionalId: string) => {
  return await prisma.application.findMany({
    where: { professionalId },
    include: {
      job: {
        include: {
          client: {
            select: { name: true, avatarUrl: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getProfessionalStats = async (professionalId: string) => {
  const grouped = await prisma.application.groupBy({
    by: ["status"],
    where: { professionalId },
    _count: { status: true },
  });

  const stats = { total: 0, pending: 0, accepted: 0, rejected: 0 };

  for (const entry of grouped) {
    const count = entry._count.status;
    stats.total += count;

    switch (entry.status) {
      case "PENDING":
        stats.pending = count;
        break;
      case "ACCEPTED":
        stats.accepted = count;
        break;
      case "REJECTED":
        stats.rejected = count;
        break;
    }
  }

  return stats;
};

export const getJobApplications = async (clientId: string, jobId: string) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { clientId: true },
  });

  if (!job) return { error: "Job not found", status: 404 };
  if (job.clientId !== clientId)
    return { error: "Unauthorized access", status: 403 };

  return await prisma.application.findMany({
    where: { jobId },
    include: {
      professional: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          professionalProfile: {
            select: {
              title: true,
              skills: true,
            },
          },
        },
      },
      job: {
        select: {
          title: true,
          budget: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateApplicationStatus = async (
  clientId: string,
  applicationId: string,
  status: "ACCEPTED" | "REJECTED",
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: { select: { clientId: true } } },
  });

  if (!application) return { error: "Application not found", status: 404 };
  if (application.job.clientId !== clientId)
    return { error: "Unauthorized access", status: 403 };

  return await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });
};
