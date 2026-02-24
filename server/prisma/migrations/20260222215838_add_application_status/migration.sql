-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "proposedRate" DOUBLE PRECISION,
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING';
