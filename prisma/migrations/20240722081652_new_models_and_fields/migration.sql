/*
  Warnings:

  - You are about to drop the column `userId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `itemType` on the `JobRequest` table. All the data in the column will be lost.
  - The `status` column on the `Request` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[repItemId]` on the table `JobRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `repItemId` to the `JobRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('JOB', 'RESOURCE', 'VENUE');

-- CreateEnum
CREATE TYPE "RequestStatusType" AS ENUM ('PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED', 'ON_HOLD', 'DELAYED', 'UNDER_REVIEW', 'SCHEDULED');

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_userId_fkey";

-- DropForeignKey
ALTER TABLE "JobRequest" DROP CONSTRAINT "JobRequest_requestId_fkey";

-- DropForeignKey
ALTER TABLE "ResourceRequest" DROP CONSTRAINT "ResourceRequest_requestId_fkey";

-- DropForeignKey
ALTER TABLE "VenueRequest" DROP CONSTRAINT "VenueRequest_requestId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "JobRequest" DROP COLUMN "itemType",
ADD COLUMN     "repItemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "status",
ADD COLUMN     "status" "RequestStatusType" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ItemCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "itemCategory" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "serialNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobRequest_repItemId_key" ON "JobRequest"("repItemId");

-- AddForeignKey
ALTER TABLE "JobRequest" ADD CONSTRAINT "JobRequest_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequest" ADD CONSTRAINT "JobRequest_repItemId_fkey" FOREIGN KEY ("repItemId") REFERENCES "RepItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueRequest" ADD CONSTRAINT "VenueRequest_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceRequest" ADD CONSTRAINT "ResourceRequest_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
