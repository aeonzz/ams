import { z } from "zod";
import { requestSchemaBase } from "../request";
import { ItemStatusSchema } from "prisma/generated/zod";

export const returnableResourceRequestSchemaBase = z.object({
  itemId: z.string({
    required_error: "Name is required",
  }),
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
  returnDateAndTime: z
    .date({
      required_error: "Return date is required",
    })
    .min(new Date(), {
      message: "Return date must be in the future",
    })
    .refine((date) => date.getHours() !== 0 || date.getMinutes() !== 0, {
      message: "Time cannot be exactly midnight (00:00)",
    }),
  purpose: z
    .string()
    .min(1, { message: "This field is required" })
    .max(700, { message: "Cannot be more than 700 characters long" }),
  location: z
    .string()
    .min(1, { message: "This field is required" })
    .max(100, { message: "Cannot be more than 100 characters long" }),
  notes: z
    .string()
    .max(700, { message: "Cannot be more than 700 characters long" })
    .optional(),
  inProgress: z.boolean().optional(),
  isReturned: z.boolean().optional(),
  returnCondition: z.string().optional(),
  itemStatus: ItemStatusSchema.optional(),
});

export const returnableResourceRequestSchema =
  returnableResourceRequestSchemaBase.refine(
    (data) => data.dateAndTimeNeeded <= data.returnDateAndTime,
    {
      message:
        "Date and time needed must not be later than the return date and time",
      path: ["dateAndTimeNeeded"],
    }
  );

export type ReturnableResourceRequestSchema = z.infer<
  typeof returnableResourceRequestSchema
>;

export const returnableResourceRequestSchemaWithPath =
  returnableResourceRequestSchemaBase.extend({
    path: z.string(),
  });

export const extendedReturnableResourceRequestSchema = requestSchemaBase.merge(
  returnableResourceRequestSchemaWithPath
);

export type ExtendedReturnableResourceRequestSchema = z.infer<
  typeof extendedReturnableResourceRequestSchema
>;

export const updateReturnableResourceRequestSchema =
  returnableResourceRequestSchemaBase.partial();

export type UpdateReturnableResourceRequestSchema = z.infer<
  typeof updateReturnableResourceRequestSchema
>;

export const updateReturnableResourceRequestSchemaWithPath =
  updateReturnableResourceRequestSchema.extend({
    id: z.string(),
    path: z.string(),
  });

export type UpdateReturnableResourceRequestSchemaWithPath = z.infer<
  typeof updateReturnableResourceRequestSchemaWithPath
>;

export const createInventoryItemSchemaServer = z.object({
  name: z.string(),
  description: z.string(),
  departmentId: z.string(),
  imageUrl: z.array(
    z.string({
      required_error: "Image is required",
    })
  ),
  inventoryCount: z.number(),
});

export const createInventoryItemSchemaWithPath =
  createInventoryItemSchemaServer.extend({
    path: z.string(),
  });

export type CreateInventoryItemSchemaWithPath = z.infer<
  typeof createInventoryItemSchemaWithPath
>;

export const updateInventoryItemSchemaServer = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.array(z.string()).optional(),
});

export const extendedUpdateInventoryItemServerSchema =
  updateInventoryItemSchemaServer.extend({
    path: z.string(),
    id: z.string().optional(),
  });

export type ExtendedUpdateInventoryItemServerSchema = z.infer<
  typeof extendedUpdateInventoryItemServerSchema
>;

export const updateInventoryItemStatusesSchema = z.object({
  ids: z.string().array(),
  status: ItemStatusSchema.optional(),
  path: z.string(),
});

export type UpdateInventoryItemStatusesSchema = z.infer<
  typeof updateInventoryItemStatusesSchema
>;

export const deleteInventoryItemsSchema = z.object({
  ids: z.string().array(),
  path: z.string(),
});

export type DeleteInventoryItemsSchema = z.infer<
  typeof deleteInventoryItemsSchema
>;

export const updateInventorySubItemItemSchemaServer = z.object({
  status: ItemStatusSchema.optional(),
});

export const extendedUpdateInventorySubItemItemServerSchema =
  updateInventorySubItemItemSchemaServer.extend({
    path: z.string(),
    id: z.string().optional(),
  });

export type ExtendedUpdateInventorySubItemItemServerSchema = z.infer<
  typeof extendedUpdateInventorySubItemItemServerSchema
>;

export const updateInventorySubItemStatusesSchema = z.object({
  ids: z.string().array(),
  status: ItemStatusSchema.optional(),
  path: z.string(),
});

export type UpdateInventorySubItemStatusesSchema = z.infer<
  typeof updateInventorySubItemStatusesSchema
>;

export const deleteInventorySubItemsSchema = z.object({
  ids: z.string().array(),
  path: z.string(),
});

export type DeleteInventorySubItemsSchema = z.infer<
  typeof deleteInventorySubItemsSchema
>;

export const createInventorySubItemSchemaServer = z.object({
  subName: z
    .string()
    .min(1, "returnableItemId is required")
    .max(100, "Name must be 100 characters or less"),
  serialNumber: z
    .string()
    .min(1, "returnableItemId is required")
    .max(100, "Name must be 100 characters or less"),
  imageUrl: z.array(
    z.string({
      required_error: "Image is required",
    })
  ),
});

export const extendCreateInventoryItemSchema =
  createInventorySubItemSchemaServer.extend({
    path: z.string(),
    inventoryId: z.string(),
  });

export type ExtendCreateInventoryItemSchema = z.infer<
  typeof extendCreateInventoryItemSchema
>;

export const updateInventoryItemSchema =
  createInventorySubItemSchemaServer.partial();

export type UpdateInventoryItemSchema = z.infer<
  typeof updateInventoryItemSchema
>;

export const extendedUpdateInventoryItemSchema =
  updateInventoryItemSchema.extend({
    path: z.string(),
    inventoryId: z.string(),
  });

export type ExtendedUpdateInventoryItemSchema = z.infer<
  typeof extendedUpdateInventoryItemSchema
>;
