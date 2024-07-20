import { z } from 'zod';

/////////////////////////////////////////
// ITEM CATEGORY SCHEMA
/////////////////////////////////////////

export const ItemCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  createdAt: z.coerce.date(),
})

export type ItemCategory = z.infer<typeof ItemCategorySchema>

export default ItemCategorySchema;
