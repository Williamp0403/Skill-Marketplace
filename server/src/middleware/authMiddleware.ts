import { clerkClient } from "@clerk/clerk-sdk-node";
import type { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  // 1. Verificar que el header existe
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No se encontró el Bearer token en los headers");
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  console.log("token", token);

  try {
    // 2. Verificar el token usando Clerk
    const decoded = await clerkClient.verifyToken(token);

    // 3. Buscar el usuario en la BD para obtener su id interno y rol
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: decoded.sub },
      select: { id: true, role: true },
    });

    // 4. Guardar la información en req.auth
    // userId = id interno de la BD (para relaciones en Prisma)
    // clerkUserId = id de Clerk (solo para onboarding/creación)
    req.auth = {
      userId: dbUser?.id ?? null,
      clerkUserId: decoded.sub,
      sessionId: decoded.sid,
      role: dbUser?.role ?? null,
    };

    next();
  } catch (error) {
    console.error(
      "Error al verificar el token con Clerk:",
      (error as Error).message,
    );

    if ((error as Error).message.includes("Secret Key")) {
      return res
        .status(500)
        .json({ error: "Configuración del servidor incompleta (API Key)" });
    }

    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};
