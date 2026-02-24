import { Request, Response } from "express";
import { getAllJobs, getJobById } from "./job.service.js";

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await getAllJobs();
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export const getJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid job ID" });
    }

    const job = await getJobById(id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error(`Error fetching job ${req.params.id}:`, error);
    res.status(500).json({ error: "Failed to fetch job details" });
  }
};
