import { Router } from "express";
import userRoutes from "../modules/user/user.route.js";
import jobRoutes from "../modules/job/job.route.js";
import profileRoutes from "../modules/profile/profile.route.js";
import professionalProfileRoutes from "../modules/professionalProfile/professionalProfile.route.js";
import applicationRoutes from "../modules/application/application.routes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/jobs", jobRoutes);
router.use("/profiles", profileRoutes);
router.use("/professional-profiles", professionalProfileRoutes);
router.use("/applications", applicationRoutes);

export default router;
