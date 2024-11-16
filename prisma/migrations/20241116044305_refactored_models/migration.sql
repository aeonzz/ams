/*
  Warnings:

  - The values [IN_PROGRESS,ON_HOLD,DELAYED,UNDER_REVIEW,SCHEDULED] on the enum `RequestStatusType` will be removed. If these variants are still used in the database, this will fail.
  - The values [RESOURCE] on the enum `RequestType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `blurDataUrl` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `jobRequestId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `JobRequest` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `JobRequest` table. All the data in the column will be lost.
  - You are about to drop the column `approvedAt` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `venueName` on the `VenueRequest` table. All the data in the column will be lost.
  - You are about to drop the `ItemCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResourceRequest` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `JobRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `JobRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `JobRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `JobRequest` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `jobType` on the `JobRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `departmentId` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Request` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purpose` to the `VenueRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VenueRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venueId` to the `VenueRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED', 'REJECTED', 'REWORK_IN_PROGRESS', 'VERIFIED');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('JOB_REQUEST', 'VENUE_REQUEST', 'RETURNABLE_REQUEST', 'SUPPLY_REQUEST', 'TRANSPORT_REQUEST', 'VENUE', 'VEHICLE', 'INVENTORY_ITEM', 'USER', 'DEPARTMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('REPAIRS', 'INSTALLATION', 'INSPECTION', 'UPGRADES_RENOVATIONS', 'PREVENTIVE_MAINTENANCE', 'CALIBRATION_TESTING', 'CLEANING_JANITORIAL', 'PAINTING_SURFACE_TREATMENT', 'LANDSCAPING_GROUNDS_MAINTENANCE', 'TROUBLESHOOTING', 'TRANSPORT_VEHICLE_MAINTENANCE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'ALERT', 'REMINDER', 'SUCCESS', 'WARNING', 'APPROVAL');

-- CreateEnum
CREATE TYPE "FilePurpose" AS ENUM ('NONE', 'IMAGE', 'JOB_FORM', 'VENUE_FORM', 'TRANSPORT_FORM', 'SUPPLY_FORM', 'FACILITY_FORM');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('JOB', 'REQUEST', 'FILE', 'TASK', 'REWORK', 'SUPPLY');

-- CreateEnum
CREATE TYPE "VenueType" AS ENUM ('CLASSROOM', 'AUDITORIUM', 'SPORTS_HALL', 'LAB', 'CONFERENCE_ROOM', 'LIBRARY', 'OTHER');

-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('CITIZEN', 'BUSINESS', 'GOVERNMENT');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'LOST', 'RETURNED', 'PENDING_RETURN');

-- CreateEnum
CREATE TYPE "SupplyItemStatus" AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'ORDERED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DepartmentType" AS ENUM ('ACADEMIC', 'ADMINISTRATIVE', 'TECHNICAL');

-- CreateEnum
CREATE TYPE "VenueStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'RESERVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'RESERVED');

-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatusType_new" AS ENUM ('PENDING', 'APPROVED', 'REVIEWED', 'COMPLETED', 'REJECTED', 'CANCELLED');
ALTER TABLE "Request" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Request" ALTER COLUMN "status" TYPE "RequestStatusType_new" USING ("status"::text::"RequestStatusType_new");
ALTER TYPE "RequestStatusType" RENAME TO "RequestStatusType_old";
ALTER TYPE "RequestStatusType_new" RENAME TO "RequestStatusType";
DROP TYPE "RequestStatusType_old";
ALTER TABLE "Request" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RequestType_new" AS ENUM ('JOB', 'BORROW', 'SUPPLY', 'VENUE', 'TRANSPORT');
ALTER TABLE "Request" ALTER COLUMN "type" TYPE "RequestType_new" USING ("type"::text::"RequestType_new");
ALTER TYPE "RequestType" RENAME TO "RequestType_old";
ALTER TYPE "RequestType_new" RENAME TO "RequestType";
DROP TYPE "RequestType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_jobRequestId_fkey";

-- DropForeignKey
ALTER TABLE "ResourceRequest" DROP CONSTRAINT "ResourceRequest_requestId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "blurDataUrl",
DROP COLUMN "jobRequestId",
ADD COLUMN     "departmentId" TEXT,
ADD COLUMN     "filePurpose" "FilePurpose" NOT NULL DEFAULT 'NONE';

-- AlterTable
ALTER TABLE "JobRequest" DROP COLUMN "category",
DROP COLUMN "name",
ADD COLUMN     "actualCost" DOUBLE PRECISION,
ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "costEstimate" DOUBLE PRECISION,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "estimatedTime" INTEGER,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "priority" "PriorityType" NOT NULL DEFAULT 'NO_PRIORITY',
ADD COLUMN     "rejectionCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "jobType",
ADD COLUMN     "jobType" "JobType" NOT NULL;

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "approvedAt",
DROP COLUMN "department",
DROP COLUMN "notes",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "departmentId" TEXT NOT NULL,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "reviewedBy" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "RequestType" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "department",
DROP COLUMN "role",
DROP COLUMN "username",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VenueRequest" DROP COLUMN "venueName",
ADD COLUMN     "actualEndtime" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "inProgress" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "purpose" TEXT NOT NULL,
ADD COLUMN     "setupRequirements" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "venueId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ItemCategory";

-- DropTable
DROP TABLE "ResourceRequest";

-- DropEnum
DROP TYPE "RoleType";

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "name" TEXT NOT NULL,
    "acceptsJobs" BOOLEAN NOT NULL DEFAULT false,
    "managesTransport" BOOLEAN NOT NULL DEFAULT false,
    "managesBorrowRequest" BOOLEAN NOT NULL DEFAULT false,
    "managesSupplyRequest" BOOLEAN NOT NULL DEFAULT false,
    "managesFacility" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "responsibilities" TEXT,
    "departmentType" "DepartmentType" NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDepartment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "resourceId" TEXT,
    "resourceType" "ResourceType" NOT NULL,
    "notificationType" "NotificationType" NOT NULL DEFAULT 'INFO',
    "recepientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rework" (
    "id" TEXT NOT NULL,
    "jobRequestId" TEXT NOT NULL,
    "reworkStartDate" TIMESTAMP(3),
    "reworkEndDate" TIMESTAMP(3),
    "status" BOOLEAN NOT NULL DEFAULT false,
    "rejectionReason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobRequestEvaluation" (
    "id" TEXT NOT NULL,
    "clientType" "ClientType" NOT NULL,
    "position" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "regionOfResidence" TEXT NOT NULL,
    "awarenessLevel" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "helpfulness" TEXT NOT NULL,
    "surveyResponses" JSONB NOT NULL,
    "suggestions" TEXT,
    "jobRequestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobRequestEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "venueType" "VenueType" NOT NULL,
    "rulesAndRegulations" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "VenueStatus" NOT NULL DEFAULT 'AVAILABLE',
    "departmentId" TEXT NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueSetupRequirement" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueSetupRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnableRequest" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "dateAndTimeNeeded" TIMESTAMP(3) NOT NULL,
    "inProgress" BOOLEAN NOT NULL DEFAULT false,
    "returnDateAndTime" TIMESTAMP(3) NOT NULL,
    "isOverdue" BOOLEAN NOT NULL DEFAULT false,
    "actualReturnDate" TIMESTAMP(3),
    "isReturned" BOOLEAN NOT NULL DEFAULT false,
    "returnCondition" TEXT,
    "purpose" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "notes" TEXT,
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReturnableRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventorySubItem" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "subName" TEXT NOT NULL,
    "serialNumber" TEXT,
    "inventoryId" TEXT NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'AVAILABLE',
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventorySubItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "departmentId" TEXT NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplyRequest" (
    "id" TEXT NOT NULL,
    "dateAndTimeNeeded" TIMESTAMP(3) NOT NULL,
    "purpose" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplyItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "SupplyItemStatus" NOT NULL DEFAULT 'IN_STOCK',
    "imageUrl" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "lowStockThreshold" INTEGER NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "categoryId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplyItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplyItemCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplyItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplyRequestItem" (
    "id" TEXT NOT NULL,
    "supplyRequestId" TEXT NOT NULL,
    "supplyItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplyRequestItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportRequest" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "numberOfPassengers" INTEGER NOT NULL,
    "passengersName" TEXT[],
    "destination" TEXT NOT NULL,
    "inProgress" BOOLEAN NOT NULL DEFAULT false,
    "dateAndTimeNeeded" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "requestId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,

    CONSTRAINT "TransportRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "VehicleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "departmentId" TEXT NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDepartment_userId_departmentId_key" ON "UserDepartment"("userId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_departmentId_key" ON "UserRole"("userId", "roleId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "JobRequestEvaluation_jobRequestId_key" ON "JobRequestEvaluation"("jobRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "ReturnableRequest_requestId_key" ON "ReturnableRequest"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "SupplyRequest_requestId_key" ON "SupplyRequest"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "SupplyRequestItem_supplyRequestId_supplyItemId_key" ON "SupplyRequestItem"("supplyRequestId", "supplyItemId");

-- CreateIndex
CREATE UNIQUE INDEX "TransportRequest_requestId_key" ON "TransportRequest"("requestId");

-- AddForeignKey
ALTER TABLE "UserDepartment" ADD CONSTRAINT "UserDepartment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDepartment" ADD CONSTRAINT "UserDepartment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequest" ADD CONSTRAINT "JobRequest_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rework" ADD CONSTRAINT "Rework_jobRequestId_fkey" FOREIGN KEY ("jobRequestId") REFERENCES "JobRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRequestEvaluation" ADD CONSTRAINT "JobRequestEvaluation_jobRequestId_fkey" FOREIGN KEY ("jobRequestId") REFERENCES "JobRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueRequest" ADD CONSTRAINT "VenueRequest_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSetupRequirement" ADD CONSTRAINT "VenueSetupRequirement_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnableRequest" ADD CONSTRAINT "ReturnableRequest_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventorySubItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnableRequest" ADD CONSTRAINT "ReturnableRequest_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySubItem" ADD CONSTRAINT "InventorySubItem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplyRequest" ADD CONSTRAINT "SupplyRequest_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplyItem" ADD CONSTRAINT "SupplyItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SupplyItemCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplyItem" ADD CONSTRAINT "SupplyItem_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplyRequestItem" ADD CONSTRAINT "SupplyRequestItem_supplyRequestId_fkey" FOREIGN KEY ("supplyRequestId") REFERENCES "SupplyRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplyRequestItem" ADD CONSTRAINT "SupplyRequestItem_supplyItemId_fkey" FOREIGN KEY ("supplyItemId") REFERENCES "SupplyItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportRequest" ADD CONSTRAINT "TransportRequest_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportRequest" ADD CONSTRAINT "TransportRequest_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
