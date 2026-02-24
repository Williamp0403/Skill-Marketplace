import type { Request, Response } from "express";
import * as service from "./professionalProfile.service.js";

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.auth.userId!;

    const profile = await service.createProfessionalProfileIfNotExists(userId);

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.auth.userId!;

    const updated = await service.updateProfessionalProfile(userId, req.body);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};
