import { Router } from "express";
import { getProfile, getProfiles } from "./profile.controller.js";

const router = Router();

// Public endpoints — no authMiddleware required
router.get("/", getProfiles);
router.get("/:id", getProfile);

export default router;
