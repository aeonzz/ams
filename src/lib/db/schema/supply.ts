import { z } from "zod";

export const createSupplyItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  imageUrl: z.array(z.instanceof(File), {
    required_error: "Image is required",
  }),
  quantity: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1, "Quantity must be atleast 1")),
  unit: z.string({
    required_error: "Unit is required",
  }),
  lowStockThreshold: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1, "Low stock threshold must be atleast 1")),
  expirationDate: z.date().optional(),
  categoryId: z.string({
    required_error: "Category is required",
  }),
  departmentId: z.string({
    required_error: "Department is required",
  }),
});

export type CreateSupplyItemSchema = z.infer<typeof createSupplyItemSchema>;

export const updateSupplyItemSchema = createSupplyItemSchema.partial().extend({
  quantity: z.number().min(1, "Quantity must be at least 1").optional(),
  lowStockThreshold: z
    .number()
    .min(1, "Low stock threshold must be at least 1")
    .optional(),
});

export type UpdateSupplyItemSchema = z.infer<typeof updateSupplyItemSchema>;
