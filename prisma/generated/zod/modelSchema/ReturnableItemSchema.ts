import { z } from 'zod';
import { ReturnableItemStatusSchema } from '../inputTypeSchemas/ReturnableItemStatusSchema'
import type { ItemReservationWithRelations } from './ItemReservationSchema'
import { ItemReservationWithRelationsSchema } from './ItemReservationSchema'

/////////////////////////////////////////
// RETURNABLE ITEM SCHEMA
/////////////////////////////////////////

export const ReturnableItemSchema = z.object({
  status: ReturnableItemStatusSchema,
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
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
  itemReservation: ItemReservationWithRelations[];
};

export type ReturnableItemWithRelations = z.infer<typeof ReturnableItemSchema> & ReturnableItemRelations

export const ReturnableItemWithRelationsSchema: z.ZodType<ReturnableItemWithRelations> = ReturnableItemSchema.merge(z.object({
  itemReservation: z.lazy(() => ItemReservationWithRelationsSchema).array(),
}))

export default ReturnableItemSchema;
