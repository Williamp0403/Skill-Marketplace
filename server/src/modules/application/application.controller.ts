import { Request, Response } from "express";
import {
  createApplication,
  getProfessionalApplications,
  getProfessionalStats,
  getJobApplications,
  updateApplicationStatus,
} from "./application.service.js";

export const applyToJob = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.auth.userId!;
    const { jobId, message, proposedRate } = req.body;

    const application = await createApplication(
      userId,
      jobId,
      message,
      proposedRate,
    );

    if ("error" in application) {
      return res
        .status(application.status || 400)
        .json({ error: application.error });
    }

    return res.status(201).json(application);
  } catch (error) {
    console.error("Error applying to job:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyApplications = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const userId = req.auth.userId!;

    const applications = await getProfessionalApplications(userId);
    return res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyStats = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.auth.userId!;
    const stats = await getProfessionalStats(userId);
    return res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getApplicationsForJob = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const clientId = req.auth.userId!;
    const { jobId } = req.params;

    if (typeof jobId !== "string") {
      return res.status(400).json({ error: "Invalid job ID" });
    }

    const applications = await getJobApplications(clientId, jobId);

    if (Array.isArray(applications)) {
      return res.json(applications);
    }

    if ("error" in applications) {
      return res
        .status(applications.status)
        .json({ error: applications.error });
    }
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateApplicationStatusController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const clientId = req.auth.userId!;
    const { id } = req.params;
    const { status } = req.body;

    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid application ID" });
    }

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const application = await updateApplicationStatus(
      clientId,
      id,
      status as "ACCEPTED" | "REJECTED",
    );

    if ("error" in application) {
      return res.status(application.status).json({ error: application.error });
    }

    return res.json(application);
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
