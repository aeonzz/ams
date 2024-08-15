/*
  Warnings:

  - The values [NO-PRIORITY] on the enum `PriorityType` will be removed. If these variants are still used in the database, this will fail.
  - The values [IN-PROGRESS,ON-HOLD,UNDER-REVIEW] on the enum `RequestStatusType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PriorityType_new" AS ENUM ('NO_PRIORITY', 'LOW', 'MEDIUM', 'HIGH', 'URGENT');
ALTER TABLE "Request" ALTER COLUMN "priority" TYPE "PriorityType_new" USING ("priority"::text::"PriorityType_new");
ALTER TYPE "PriorityType" RENAME TO "PriorityType_old";
ALTER TYPE "PriorityType_new" RENAME TO "PriorityType";
DROP TYPE "PriorityType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatusType_new" AS ENUM ('PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED', 'ON_HOLD', 'DELAYED', 'UNDER_REVIEW', 'SCHEDULED');
ALTER TABLE "Request" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Request" ALTER COLUMN "status" TYPE "RequestStatusType_new" USING ("status"::text::"RequestStatusType_new");
ALTER TYPE "RequestStatusType" RENAME TO "RequestStatusType_old";
ALTER TYPE "RequestStatusType_new" RENAME TO "RequestStatusType";
DROP TYPE "RequestStatusType_old";
ALTER TABLE "Request" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
