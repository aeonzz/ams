import { z } from "zod";

export const createInventoryItemSchema = z.object({
  subName: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  serialNumber: z.string().optional(),
  imageUrl: z.array(z.instanceof(File), {
    required_error: "Image is required",
  }),
});

export type CreateInventoryItemSchema = z.infer<
  typeof createInventoryItemSchema
>;

export const updateInventorySubItemSchema = createInventoryItemSchema.partial();

export type UpdateInventorySubItemSchema = z.infer<
  typeof updateInventorySubItemSchema
>;
