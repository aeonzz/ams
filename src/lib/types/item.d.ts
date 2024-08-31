import { InventoryItem, ReturnableItem } from "prisma/generated/zod";

type ReturnableItemType = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  inventoryCount: number;
  availableCount: number;
  inventoryItems: InventoryItem[];
};
