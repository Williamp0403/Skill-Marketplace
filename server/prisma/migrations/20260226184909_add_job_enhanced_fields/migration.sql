-- CreateEnum
CREATE TYPE "WorkModel" AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('JUNIOR', 'MID_LEVEL', 'SENIOR', 'EXPERT');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'FREELANCE', 'CONTRACT');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "experienceLevel" "ExperienceLevel" NOT NULL DEFAULT 'MID_LEVEL',
ADD COLUMN     "jobType" "JobType" NOT NULL DEFAULT 'FREELANCE',
ADD COLUMN     "location" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "workModel" "WorkModel" NOT NULL DEFAULT 'REMOTE';
