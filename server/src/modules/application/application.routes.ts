import { Router } from "express";
import {
  applyToJob,
  getMyApplications,
  getMyStats,
} from "./application.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";
import { validateData } from "../../middleware/validateDataMiddleware.js";
import { applyToJobSchema } from "./application.schema.js";

const router = Router();

// Define routes
router.post(
  "/",
  authMiddleware,
  roleMiddleware("PROFESSIONAL"),
  validateData(applyToJobSchema),
  applyToJob,
);
router.get(
  "/me",
  authMiddleware,
  roleMiddleware("PROFESSIONAL"),
  getMyApplications,
);
router.get(
  "/me/stats",
  authMiddleware,
  roleMiddleware("PROFESSIONAL"),
  getMyStats,
);

export default router;
