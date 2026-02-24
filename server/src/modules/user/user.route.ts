import { Router } from "express";
import { createUser, getUser } from "./user.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { validateData } from "../../middleware/validateDataMiddleware.js";
import { schemaUserRole } from "./user.schema.js";

const router = Router();

router.post("/", authMiddleware, validateData(schemaUserRole), createUser);
router.get("/me", authMiddleware, getUser);

export default router;
