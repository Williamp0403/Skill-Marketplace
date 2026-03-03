import { Router } from "express";
import {
  getMyClientProfile,
  updateMyClientProfile,
} from "./clientProfile.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { validateData } from "../../middleware/validateDataMiddleware.js";
import { updateClientProfileSchema } from "./clientProfile.schema.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";

const router = Router();

router.get("/me", authMiddleware, roleMiddleware("CLIENT"), getMyClientProfile);

router.patch(
  "/me",
  authMiddleware,
  roleMiddleware("CLIENT"),
  validateData(updateClientProfileSchema),
  updateMyClientProfile,
);

export default router;
