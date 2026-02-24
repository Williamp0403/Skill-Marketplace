import type { Request, Response } from "express";
import { getAllProfiles, getProfileById } from "./profile.service.js";

export const getProfiles = async (_req: Request, res: Response) => {
  try {
    const profiles = await getAllProfiles();
    res.json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid profile ID" });
    }

    const profile = await getProfileById(id);

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error(`Error fetching profile ${req.params.id}:`, error);
    res.status(500).json({ error: "Failed to fetch profile details" });
  }
};
