import type { Request, Response } from "express";
import {
  getClientProfile,
  updateClientProfile,
} from "./clientProfile.service.js";
import { TUpdateClientProfile } from "./clientProfile.schema.js";

export const getMyClientProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.auth.userId!;

    const profile = await getClientProfile(userId);
    res.json(profile);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMyClientProfile = async (
  req: Request<{}, {}, TUpdateClientProfile>,
  res: Response,
) => {
  try {
    const userId = req.auth.userId!;
    const updatedProfile = await updateClientProfile(userId, req.body);
    res.json(updatedProfile);
  } catch (e: any) {
    if (e.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};
