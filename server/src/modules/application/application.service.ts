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
