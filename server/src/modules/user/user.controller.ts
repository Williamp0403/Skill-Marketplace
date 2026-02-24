import type { Request, Response } from "express";
import { createUserRole, getUserRole } from "./user.service.js";
import { TUserRole } from "./user.schema.js";

export const createUser = async (
  req: Request<{}, {}, TUserRole>,
  res: Response,
) => {
  const { role, name, avatarUrl } = req.body;
  const clerkUserId = req.auth.clerkUserId;

  try {
    const user = await createUserRole(clerkUserId, { role, name, avatarUrl });

    if ("error" in user) {
      return res.status(409).json({ error: user.error });
    }

    res.status(201).json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const clerkUserId = req.auth.clerkUserId;

  try {
    const user = await getUserRole(clerkUserId);

    if ("needsOnboarding" in user) {
      return res.status(404).json({ needsOnboarding: true });
    }

    res.json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
};
