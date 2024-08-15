/*
  Warnings:

  - The values [IN_PROGRESS,ON_HOLD,UNDER_REVIEW] on the enum `RequestStatusType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `description` on the `JobRequest` table. All the data in the column will be lost.
  - You are about to drop the column `repItemId` on the `JobRequest` table. All the data in the column will be lost.
  - You are about to drop the `RepItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `JobRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `JobRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PriorityType" ADD VALUE 'NO-PRIORITY';

-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatusType_new" AS ENUM ('PENDING', 'APPROVED', 'IN-PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED', 'ON-HOLD', 'DELAYED', 'UNDER-REVIEW', 'SCHEDULED');
ALTER TABLE "Request" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Request" ALTER COLUMN "status" TYPE "RequestStatusType_new" USING ("status"::text::"RequestStatusType_new");
ALTER TYPE "RequestStatusType" RENAME TO "RequestStatusType_old";
ALTER TYPE "RequestStatusType_new" RENAME TO "RequestStatusType";
DROP TYPE "RequestStatusType_old";
ALTER TABLE "Request" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "JobRequest" DROP CONSTRAINT "JobRequest_repItemId_fkey";

-- DropIndex
DROP INDEX "JobRequest_repItemId_key";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "jobRequestId" TEXT;

-- AlterTable
ALTER TABLE "JobRequest" DROP COLUMN "description",
DROP COLUMN "repItemId",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "RepItem";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_jobRequestId_fkey" FOREIGN KEY ("jobRequestId") REFERENCES "JobRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
