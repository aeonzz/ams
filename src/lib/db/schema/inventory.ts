import { z } from "zod";

export const createInventoryItemSchema = z.object({
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
  departmentId: z.string().min(1, "Department is required"),
  inventoryCount: z
    .number()
    .min(1, "inventory is required")
    .max(100, "Cannot exceed 100 "),
});

export type CreateInventoryItemSchema = z.infer<
  typeof createInventoryItemSchema
>;
export const updateInventoryItemSchema = createInventoryItemSchema.partial();

export type UpdateInventoryItemSchema = z.infer<
  typeof updateInventoryItemSchema
>;

export const extendedUpdateInventoryItemSchema =
  updateInventoryItemSchema.extend({
    path: z.string(),
    id: z.string().optional(),
  });
