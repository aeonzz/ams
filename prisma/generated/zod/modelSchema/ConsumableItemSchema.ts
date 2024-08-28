import { z } from 'zod';
import { ConsumableItemStatusSchema } from '../inputTypeSchemas/ConsumableItemStatusSchema'
import type { ConsumableRequestWithRelations } from './ConsumableRequestSchema'
import { ConsumableRequestWithRelationsSchema } from './ConsumableRequestSchema'

/////////////////////////////////////////
// CONSUMABLE ITEM SCHEMA
/////////////////////////////////////////

export const ConsumableItemSchema = z.object({
  status: ConsumableItemStatusSchema,
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  quantity: z.number().int(),
  unit: z.string(),
  lowStockThreshold: z.number().int(),
  expirationDate: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  consumableRequestId: z.string().nullable(),
})

export type ConsumableItem = z.infer<typeof ConsumableItemSchema>

/////////////////////////////////////////
// CONSUMABLE ITEM RELATION SCHEMA
/////////////////////////////////////////

export type ConsumableItemRelations = {
  consumableRequest?: ConsumableRequestWithRelations | null;
};

export type ConsumableItemWithRelations = z.infer<typeof ConsumableItemSchema> & ConsumableItemRelations

export const ConsumableItemWithRelationsSchema: z.ZodType<ConsumableItemWithRelations> = ConsumableItemSchema.merge(z.object({
  consumableRequest: z.lazy(() => ConsumableRequestWithRelationsSchema).nullable(),
}))

export default ConsumableItemSchema;
