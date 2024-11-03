import { z } from "zod";

export const createSupplyItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  imageUrl: z.array(z.instanceof(File), {
    required_error: "Image is required",
  }),
  quantity: z
    .number()
    .min(1, "Quantity is required")
    .max(200, "Cannot exceed 200 "),
  unit: z.string({
    required_error: "Unit is required",
  }),
  lowStockThreshold: z
    .number()
    .min(1, "lowStockThreshold is required")
    .max(200, "Cannot exceed 200 "),
  expirationDate: z.date().optional(),
  categoryId: z.string({
    required_error: "Category is required",
  }),
  departmentId: z.string({
    required_error: "Department is required",
  }),
});

export type CreateSupplyItemSchema = z.infer<typeof createSupplyItemSchema>;

export const updateSupplyItemSchema = createSupplyItemSchema.partial();

export type UpdateSupplyItemSchema = z.infer<typeof updateSupplyItemSchema>;
