import { Router } from "express";
import * as controller from "./professionalProfile.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";
import { validateData } from "../../middleware/validateDataMiddleware.js";
import { updateProfessionalProfileSchema } from "./professionalProfile.schema.js";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  roleMiddleware("PROFESSIONAL"),
  controller.getMyProfile,
);
router.patch(
  "/me",
  authMiddleware,
  roleMiddleware("PROFESSIONAL"),
  validateData(updateProfessionalProfileSchema),
  controller.updateMyProfile,
);

export default router;
