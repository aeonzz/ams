import { SupplyItemSchema, SupplyItemStatusSchema } from "prisma/generated/zod";
import { z } from "zod";
import { requestSchemaBase } from "../request";

export const supplyResourceRequestSchema = z.object({
  items: z
    .array(
      z.object({
        supplyItemId: z.string().refine((val) => val !== "", {
          message: "Supply item  is required",
        }),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one item is required"),
  dateAndTimeNeeded: z
    .date({
      required_error: "Date needed is required",
    })
    .min(new Date(), {
      message: "Date needed must be in the future",
    })
    .refine((date) => date.getHours() !== 0 || date.getMinutes() !== 0, {
      message: "Time cannot be exactly midnight (00:00)",
    }),
  purpose: z
    .string()
    .min(1, { message: "Purpose is required" })
    .max(700, { message: "Cannot be more than 700 characters long" }),
});

export type SupplyResourceRequestSchema = z.infer<
  typeof supplyResourceRequestSchema
>;

export const supplyResourceRequestSchemaWithPath =
  supplyResourceRequestSchema.extend({
    path: z.string(),
  });

export const extendedSupplyResourceRequestSchema = requestSchemaBase.merge(
  supplyResourceRequestSchemaWithPath
);

export type ExtendedSupplyResourceRequestSchema = z.infer<
  typeof extendedSupplyResourceRequestSchema
>;

export const updateSupplyResourceRequestSchema =
  supplyResourceRequestSchema.partial();

export type UpdateSupplyResourceRequestSchema = z.infer<
  typeof updateSupplyResourceRequestSchema
>;

export const updateSupplyResourceRequestSchemaWithPath =
  updateSupplyResourceRequestSchema.extend({
    id: z.string(),
    path: z.string(),
  });

export type UpdateSupplyResourceRequestSchemaWithPath = z.infer<
  typeof updateSupplyResourceRequestSchemaWithPath
>;

export const createSupplyItemSchemaServer = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  imageUrl: z.array(
    z.string({
      required_error: "Image is required",
    })
  ),
  quantity: z.number().int().min(1, "Low stock threshold must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  lowStockThreshold: z
    .number()
    .int()
    .min(1, "Low stock threshold must be at least 1"),
  expirationDate: z.date().optional(),
  categoryId: z.string().min(1, "Category is required"),
  departmentId: z.string().min(1, "Department is required"),
});

export const createSupplyItemSchemaServerWithPath =
  createSupplyItemSchemaServer.extend({
    path: z.string(),
  });

export type CreateSupplyItemSchemaServerWithPath = z.infer<
  typeof createSupplyItemSchemaServerWithPath
>;

export const updateSupplyItemItemStatusesSchema = z.object({
  ids: z.string().array(),
  status: SupplyItemStatusSchema,
  path: z.string(),
});

export type UpdateSupplyItemItemStatusesSchema = z.infer<
  typeof updateSupplyItemItemStatusesSchema
>;

export const deleteSupplyItemsSchema = z.object({
  ids: z.string().array(),
  path: z.string(),
});

export type DeleteSupplyItemsSchema = z.infer<typeof deleteSupplyItemsSchema>;

export const updateSupplyItemSchema = createSupplyItemSchemaServer.partial();

export type UpdateSupplyItemSchema = z.infer<typeof updateSupplyItemSchema>;

export const extendedUpdateSupplyItemSchema = updateSupplyItemSchema.extend({
  path: z.string(),
  id: z.string(),
});

export type ExtendedUpdateSupplyItemSchema = z.infer<
  typeof extendedUpdateSupplyItemSchema
>;

export const addSupplyItem = z.object({
  id: z.string(),
  items: z
    .array(
      z.object({
        supplyItemId: z.string().refine((val) => val !== "", {
          message: "Supply item  is required",
        }),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one item is required"),
});

export type AddsupplyItem = z.infer<typeof addSupplyItem>;

export const addSupplyItemWithPath = addSupplyItem.extend({
  path: z.string(),
});

export type AddSupplyItemWithPath = z.infer<typeof addSupplyItemWithPath>;
