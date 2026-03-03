import { Router } from "express";
import {
  getJob,
  getJobs,
  createJobPost,
  getClientJobs,
  getClientDashboardStatsController,
  getClientRecentActivityController,
} from "./job.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";
import { validateData } from "../../middleware/validateDataMiddleware.js";
import { jobCreateSchema } from "./job.schema.js";

const router = Router();

// Public endpoints
router.get("/", getJobs);
router.get("/me", authMiddleware, roleMiddleware("CLIENT"), getClientJobs);
router.get(
  "/me/stats",
  authMiddleware,
  roleMiddleware("CLIENT"),
  getClientDashboardStatsController,
);
router.get(
  "/me/recent-activity",
  authMiddleware,
  roleMiddleware("CLIENT"),
  getClientRecentActivityController,
);
router.get("/:id", getJob);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("CLIENT"),
  validateData(jobCreateSchema),
  createJobPost,
);

export default router;
