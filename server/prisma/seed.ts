import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "../src/generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Init seed...");

  // 0. Clean database (Optional: Use with caution in prod)
  // Delete jobs first to avoid foreign key constraints if you were deleting users
  await prisma.job.deleteMany();
  console.log("🧹 Previous jobs deleted");

  // 1. Create/Find a Client User
  const clerkUserId = "user_39qwNBKCl1OW6MI8AzBzCHM5Snf"; // Valid Client User ID from Clerk

  const clientUser = await prisma.user.upsert({
    where: { clerkUserId },
    update: {},
    create: {
      clerkUserId,
      role: UserRole.CLIENT,
    },
  });

  console.log(`👤 Client User created/found: ${clientUser.id}`);

  // 2. Create Jobs
  const jobs = [
    {
      title: "Desarrollo de Landing Page en React",
      description:
        "Necesito una landing page moderna para mi startup. Debe ser responsive y tener animaciones suaves.",
      budget: 500.0,
      clientId: clientUser.id,
    },
    {
      title: "API REST con Node.js y Express",
      description:
        "Busco un backend developer para crear una API RESTful segura y escalable para una aplicación móvil.",
      budget: 800.0,
      clientId: clientUser.id,
    },
    {
      title: "Diseño UI/UX para App Móvil",
      description:
        "Necesito el diseño de interfaz y experiencia de usuario para una app de delivery. Entregables en Figma.",
      budget: 400.0,
      clientId: clientUser.id,
    },
    {
      title: "Corrección de Bugs en Sitio WordPress",
      description:
        "Tengo un sitio en WordPress que está presentando errores en el checkout. Necesito alguien que lo solucione urgente.",
      budget: 150.0,
      clientId: clientUser.id,
    },
    {
      title: "Consultoría de SEO Técnico",
      description:
        "Auditoría completa de SEO técnico para mi e-commerce. Necesito mejorar el ranking en Google.",
      budget: 300.0,
      clientId: clientUser.id,
    },
  ];

  for (const job of jobs) {
    const createdJob = await prisma.job.create({
      data: job,
    });
    console.log(`📝 Job created: ${createdJob.title}`);
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
