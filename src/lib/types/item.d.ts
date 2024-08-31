import { InventoryItem, ReturnableItem } from "prisma/generated/zod";
import { type ReturnableItemStatusType } from "prisma/generated/zod/inputTypeSchemas/ReturnableItemStatusSchema";

export type ReturnableItemType = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  inventoryCount: number;
  availableCount: number;
  inventoryItems: InventoryItem[];
};

export type InventoryItemType = {
  id: string;
  name: string;
  description: string;
  status: ReturnableItemStatusType;
  imageUrl: any;
  createdAt: Date;
  updatedAt: Date;
};
