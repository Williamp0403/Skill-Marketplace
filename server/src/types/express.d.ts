import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      auth: {
        userId: string | null;
        clerkUserId: string;
        sessionId: string;
        role: string | null;
      };
    }
  }
}
