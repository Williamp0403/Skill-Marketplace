import prisma from "../../lib/prisma.js";
import { UserRole } from "../../generated/prisma/client.js";

export const createUserRole = async (
  clerkUserId: string,
  data: { role: "CLIENT" | "PROFESSIONAL"; name?: string; avatarUrl?: string },
) => {
  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (existingUser) {
    return { error: "User already exists" };
  }

  const user = await prisma.user.create({
    data: {
      clerkUserId,
      role: data.role as UserRole,
      name: data.name || null,
      avatarUrl: data.avatarUrl || null,
    },
  });

  return user;
};

export const getUserRole = async (clerkUserId: string) => {
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    return { needsOnboarding: true };
  }

  return user;
};

export const updateUserFromClerk = async (
  clerkUserId: string,
  data: { name?: string; avatarUrl?: string },
) => {
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  // Si el usuario no existe aún en nuestra BD (no ha hecho onboarding), no hacemos nada
  if (!user) return null;

  return await prisma.user.update({
    where: { clerkUserId },
    data: {
      name: data.name ?? user.name,
      avatarUrl: data.avatarUrl ?? user.avatarUrl,
    },
  });
};
