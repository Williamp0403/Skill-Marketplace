import type { NextFunction, Request, Response } from "express";

/**
 * roleMiddleware - Factory de middleware que protege rutas por rol.
 *
 * Verifica que el rol del usuario (ya disponible en req.auth.role gracias
 * al authMiddleware) esté en la lista de roles permitidos.
 *
 * Requiere que authMiddleware se ejecute ANTES.
 *
 * @example
 * // Solo profesionales
 * router.get("/me", authMiddleware, roleMiddleware("PROFESSIONAL"), controller.getMyProfile);
 *
 * // Profesionales O clientes
 * router.get("/data", authMiddleware, roleMiddleware("PROFESSIONAL", "CLIENT"), controller.getData);
 */
export const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.auth?.role;

    if (!userRole) {
      return res.status(403).json({ error: "No tienes un rol asignado" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: "No tienes permiso para acceder a este recurso",
      });
    }

    next();
  };
};
