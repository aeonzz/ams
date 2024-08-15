/*
  Warnings:

  - The values [NO-PRIORITY] on the enum `PriorityType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PriorityType_new" AS ENUM ('NO_PRIORITY', 'LOW', 'MEDIUM', 'HIGH', 'URGENT');
ALTER TABLE "Request" ALTER COLUMN "priority" TYPE "PriorityType_new" USING ("priority"::text::"PriorityType_new");
ALTER TYPE "PriorityType" RENAME TO "PriorityType_old";
ALTER TYPE "PriorityType_new" RENAME TO "PriorityType";
DROP TYPE "PriorityType_old";
COMMIT;
