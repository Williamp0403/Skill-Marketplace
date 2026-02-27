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
  return prisma.application.findMany({
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
