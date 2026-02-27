import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  UserRole,
  WorkModel,
  ExperienceLevel,
  JobType,
} from "../src/generated/prisma/client.js";

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
  const clerkUserId = "user_3ADhbQObXHoY4JwgtnUZLp5yZhd"; // Valid Client User ID from Clerk

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
      workModel: WorkModel.REMOTE,
      experienceLevel: ExperienceLevel.MID_LEVEL,
      jobType: JobType.FREELANCE,
      location: "Latinoamérica",
      skills: ["React", "Tailwind CSS", "Framer Motion"],
      clientId: clientUser.id,
    },
    {
      title: "API REST con Node.js y Express",
      description:
        "Busco un backend developer para crear una API RESTful segura y escalable para una aplicación móvil.",
      budget: 1200.0,
      workModel: WorkModel.REMOTE,
      experienceLevel: ExperienceLevel.SENIOR,
      jobType: JobType.CONTRACT,
      location: "España / Remoto",
      skills: ["Node.js", "Express", "PostgreSQL", "Prisma"],
      clientId: clientUser.id,
    },
    {
      title: "Diseño UI/UX para App Móvil",
      description:
        "Necesito el diseño de interfaz y experiencia de usuario para una app de delivery. Entregables en Figma.",
      budget: 800.0,
      workModel: WorkModel.HYBRID,
      experienceLevel: ExperienceLevel.MID_LEVEL,
      jobType: JobType.FREELANCE,
      location: "Madrid, España",
      skills: ["Figma", "UI Design", "UX Research"],
      clientId: clientUser.id,
    },
    {
      title: "Corrección de Bugs en Sitio WordPress",
      description:
        "Tengo un sitio en WordPress que está presentando errores en el checkout. Necesito alguien que lo solucione urgente.",
      budget: 150.0,
      workModel: WorkModel.REMOTE,
      experienceLevel: ExperienceLevel.JUNIOR,
      jobType: JobType.FREELANCE,
      location: "Cualquier lugar",
      skills: ["WordPress", "PHP", "WooCommerce"],
      clientId: clientUser.id,
    },
    {
      title: "Consultoría de SEO Técnico",
      description:
        "Auditoría completa de SEO técnico para mi e-commerce. Necesito mejorar el ranking en Google.",
      budget: 450.0,
      workModel: WorkModel.REMOTE,
      experienceLevel: ExperienceLevel.EXPERT,
      jobType: JobType.CONTRACT,
      location: "USA / Remoto",
      skills: ["SEO", "Google Analytics", "Technical Audit"],
      clientId: clientUser.id,
    },
    {
      title: "Bot de Discord con integración de IA",
      description:
        "Queremos un bot para nuestra comunidad que use GPT-4 para responder preguntas frecuentes y moderar.",
      budget: 350.0,
      workModel: WorkModel.REMOTE,
      experienceLevel: ExperienceLevel.MID_LEVEL,
      jobType: JobType.FREELANCE,
      location: "Global",
      skills: ["Discord.js", "OpenAI API", "JavaScript"],
      clientId: clientUser.id,
    },
    {
      title: "Mesa de Ayuda - Soporte Técnico IT",
      description:
        "Soporte técnico para oficinas locales. Configuración de redes y mantenimiento preventivo.",
      budget: 600.0,
      workModel: WorkModel.ONSITE,
      experienceLevel: ExperienceLevel.JUNIOR,
      jobType: JobType.PART_TIME,
      location: "Bogotá, Colombia",
      skills: ["Networking", "Windows Server", "Hardware"],
      clientId: clientUser.id,
    },
    {
      title: "Senior DevOps Engineer - AWS Cloud",
      description:
        "Optimización de infraestructura en AWS, implementación de CI/CD y monitoreo con Grafana.",
      budget: 2500.0,
      workModel: WorkModel.REMOTE,
      experienceLevel: ExperienceLevel.SENIOR,
      jobType: JobType.FULL_TIME,
      location: "USA / Europa",
      skills: ["AWS", "Terraform", "Docker", "Kubernetes"],
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
