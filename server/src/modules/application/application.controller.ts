import { Request, Response } from "express";
import {
  createApplication,
  getProfessionalApplications,
  getProfessionalStats,
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
