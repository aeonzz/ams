import { z } from 'zod';
import { ReturnableItemStatusSchema } from '../inputTypeSchemas/ReturnableItemStatusSchema'
import type { ReturnableRequestWithRelations } from './ReturnableRequestSchema'
import { ReturnableRequestWithRelationsSchema } from './ReturnableRequestSchema'

/////////////////////////////////////////
// RETURNABLE ITEM SCHEMA
/////////////////////////////////////////

export const ReturnableItemSchema = z.object({
  status: ReturnableItemStatusSchema,
  id: z.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  serialNumber: z.string().nullable(),
  lastMaintenance: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ReturnableItem = z.infer<typeof ReturnableItemSchema>

/////////////////////////////////////////
// RETURNABLE ITEM RELATION SCHEMA
/////////////////////////////////////////

export type ReturnableItemRelations = {
  returnableRequest: ReturnableRequestWithRelations[];
};

export type ReturnableItemWithRelations = z.infer<typeof ReturnableItemSchema> & ReturnableItemRelations

export const ReturnableItemWithRelationsSchema: z.ZodType<ReturnableItemWithRelations> = ReturnableItemSchema.merge(z.object({
  returnableRequest: z.lazy(() => ReturnableRequestWithRelationsSchema).array(),
}))

export default ReturnableItemSchema;
