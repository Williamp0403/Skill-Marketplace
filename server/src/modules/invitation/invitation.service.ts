import prisma from "../../lib/prisma.js";

export const createInvitation = async (
  clientId: string,
  professionalId: string,
  jobId: string,
  message?: string,
) => {
  const professionalUser = await prisma.user.findUnique({
    where: { id: professionalId, role: "PROFESSIONAL" },
  });

  if (!professionalUser)
    return { error: "Professional not found", status: 404 };

  const job = await prisma.job.findUnique({
    where: { id: jobId, clientId },
  });

  if (!job)
    return { error: "Job not found or doesn't belong to client", status: 404 };
  if (job.status !== "OPEN") return { error: "Job is not open", status: 400 };

  const existingInvitation = await prisma.invitation.findUnique({
    where: {
      clientId_professionalId_jobId: {
        clientId,
        professionalId,
        jobId,
      },
    },
  });

  if (existingInvitation) {
    return { error: "Invitation already sent", status: 400 };
  }

  const invitation = await prisma.invitation.create({
    data: {
      clientId,
      professionalId,
      jobId,
      message,
    },
    include: {
      job: true,
      professional: {
        include: {
          professionalProfile: true,
        },
      },
    },
  });

  return invitation;
};

export const getProfessionalInvitations = async (professionalId: string) => {
  const invitations = await prisma.invitation.findMany({
    where: { professionalId },
    include: {
      job: true,
      client: {
        include: {
          clientProfile: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return invitations;
};

export const respondToInvitation = async (
  professionalId: string,
  invitationId: string,
  status: "ACCEPTED" | "DECLINED",
) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
  });

  if (!invitation) return { error: "Invitation not found", status: 404 };
  if (invitation.professionalId !== professionalId)
    return { error: "This invitation doesn't belong to you", status: 403 };
  if (invitation.status !== "PENDING")
    return {
      error: "You have already responded to this invitation",
      status: 400,
    };

  const updatedInvitation = await prisma.$transaction(async (tx) => {
    const inv = await tx.invitation.update({
      where: { id: invitationId },
      data: { status },
      include: { job: true },
    });

    if (status === "ACCEPTED") {
      const existingApplication = await tx.application.findUnique({
        where: {
          professionalId_jobId: {
            professionalId,
            jobId: inv.jobId,
          },
        },
      });

      if (existingApplication) {
        await tx.application.update({
          where: { id: existingApplication.id },
          data: { status: "ACCEPTED" },
        });
      } else {
        await tx.application.create({
          data: {
            professionalId,
            jobId: inv.jobId,
            message: "SYSTEM_DIRECT_HIRE",
            status: "ACCEPTED",
          },
        });
      }

      await tx.job.update({
        where: { id: inv.jobId },
        data: { status: "IN_PROGRESS" },
      });

      await tx.application.updateMany({
        where: {
          jobId: inv.jobId,
          professionalId: { not: professionalId },
          status: "PENDING",
        },
        data: { status: "REJECTED" },
      });
    }

    return inv;
  });

  return updatedInvitation;
};
