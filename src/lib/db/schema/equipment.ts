import { ReturnableItemStatusSchema } from "prisma/generated/zod";
import { z } from "zod";

export const createEquipmentSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
  imageUrl: z.array(z.instanceof(File), {
    required_error: "Image is required",
  }),
  inventoryCount: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1, "Inventory count is required")),
});

export type CreateEquipmentSchema = z.infer<typeof createEquipmentSchema>;

export const updateEquipmentSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.array(z.instanceof(File)).optional(),
});

export type UpdateEquipmentSchema = z.infer<typeof updateEquipmentSchema>;

export const extendedUpdateEquipmentSchema = updateEquipmentSchema.extend({
  path: z.string(),
  id: z.string().optional(),
});
