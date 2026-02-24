import { Router } from "express";
import { getJob, getJobs } from "./job.controller.js";

const router = Router();

// Public endpoints
router.get("/", getJobs);
router.get("/:id", getJob);

export default router;
