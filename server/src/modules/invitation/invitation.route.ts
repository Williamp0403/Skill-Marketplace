import { Router } from "express";
import {
  createInvitationController,
  getMyInvitationsController,
  respondToInvitationController,
} from "./invitation.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";
import { validateData } from "../../middleware/validateDataMiddleware.js";
import { createInvitationSchema, respondInvitationSchema } from "./invitation.schema.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("CLIENT"),
  validateData(createInvitationSchema),
  createInvitationController,
);

router.get(
  "/me",
  authMiddleware,
  roleMiddleware("PROFESSIONAL"),
  getMyInvitationsController,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("PROFESSIONAL"),
  validateData(respondInvitationSchema),
  respondToInvitationController,
);

export default router;
