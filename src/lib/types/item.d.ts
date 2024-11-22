import type { Department, InventorySubItem } from "prisma/generated/zod";
import type { ItemStatusType } from "prisma/generated/zod/inputTypeSchemas/ItemStatusSchema";
import type { SupplyItemStatusType } from "prisma/generated/zod/inputTypeSchemas/SupplyItemStatusSchema";

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

export type SupplyItemType = {
  id: string;
  name: string;
  stockNumber: string;
  unitValue: number;
  total: number;
  location: string;
  description: string | null;
  status: SupplyItemStatusType;
  imageUrl: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  expirationDate: Date | null;
  categoryName: string;
  categoryId: string;
  departmentId: string;
  departmentName: string;
  department: Department;
  createdAt: Date;
  updatedAt: Date;
};
