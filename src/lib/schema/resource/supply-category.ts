import { z } from "zod";

export const createSupplyCategory = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(700, "Cannot be more than 700 characters long"),
});

export type CreateSupplyCategory = z.infer<typeof createSupplyCategory>;

export const createSupplyCategoryWithPath = createSupplyCategory.extend({
  path: z.string(),
});

export type CreateSupplyCategoryWithPath = z.infer<
  typeof createSupplyCategoryWithPath
>;
