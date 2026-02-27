import { Router } from "express";
import { getJob, getJobs, createJobPost } from "./job.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";
import { validateData } from "../../middleware/validateDataMiddleware.js";
import { jobCreateSchema } from "./job.schema.js";

const router = Router();

// Public endpoints
router.get("/", getJobs);
router.get("/:id", getJob);

// Protected endpoints
router.post(
  "/",
  authMiddleware,
  roleMiddleware("CLIENT"),
  validateData(jobCreateSchema),
  createJobPost,
);

export default router;
