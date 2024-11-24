import { z } from "zod";

export const createSupplyItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  imageUrl: z.array(z.instanceof(File), {
    required_error: "Image is required",
  }),
  stockNumber: z.string().min(1, "Stock number is required"),
  unitValue: z
    .number({
      required_error: "Unit value is required",
    })
    .nonnegative("Unit value cannot be negative"),
  location: z.string({ required_error: "Location is required" }),
  quantity: z
    .number()
    .min(1, "Quantity is required")
    .nonnegative("Quantity cannot be negative"),
  unit: z.string({
    required_error: "Unit is required",
  }),
  lowStockThreshold: z
    .number()
    .min(1, "Low stock threshold is required")
    .nonnegative("Low stock threshold cannot be negative"),
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
