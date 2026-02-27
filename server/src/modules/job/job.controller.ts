import { Request, Response } from "express";
import { getAllJobs, getJobById, createJob } from "./job.service.js";
import { JobCreateInput } from "./job.schema.js";

export const getJobs = async (req: Request, res: Response) => {
  try {
    const { search, workModel, experienceLevel, jobType } = req.query;
    const jobs = await getAllJobs({
      search: search as string,
      workModel: workModel as string,
      experienceLevel: experienceLevel as string,
      jobType: jobType as string,
    });
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export const createJobPost = async (
  req: Request<{}, {}, JobCreateInput>,
  res: Response,
) => {
  try {
    const clientId = req.auth.userId!;

    const job = await createJob(clientId, req.body);
    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: "Failed to create job" });
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
