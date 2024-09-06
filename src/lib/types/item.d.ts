import type { Department, InventorySubItem } from "prisma/generated/zod";
import { type ItemStatusType } from "prisma/generated/zod/inputTypeSchemas/ItemStatusSchema";

export type InventoryItemType = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  departmentId: string;
  departmentName: string;
  department: Department;
  inventoryCount: number;
  availableCount: number;
  createdAt: Date;
  inventorySubItems: InventorySubItem[];
};

export type InventorySubItemType = {
  id: string;
  name: string;
  subName: string;
  serialNumber: string | null;
  description: string;
  status: ItemStatusType;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};
