import { Request, Response } from "express";
import {
  createInvitation,
  getProfessionalInvitations,
  respondToInvitation,
} from "./invitation.service.js";

export const createInvitationController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const clientId = req.auth.userId!;
    const { professionalId, jobId, message } = req.body;

    const result = await createInvitation(
      clientId,
      professionalId,
      jobId,
      message,
    );

    if ("error" in result) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creating invitation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyInvitationsController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const professionalId = req.auth.userId!;
    const result = await getProfessionalInvitations(professionalId);

    return res.json(result);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const respondToInvitationController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const professionalId = req.auth.userId!;
    const { id } = req.params;
    const { status } = req.body;

    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid invitation ID" });
    }

    const result = await respondToInvitation(professionalId, id, status);

    if ("error" in result) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    return res.json(result);
  } catch (error) {
    console.error("Error responding to invitation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
