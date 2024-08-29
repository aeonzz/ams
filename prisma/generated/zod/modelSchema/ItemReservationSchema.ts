import { z } from 'zod';
import type { ReturnableItemWithRelations } from './ReturnableItemSchema'
import type { ReturnableRequestWithRelations } from './ReturnableRequestSchema'
import { ReturnableItemWithRelationsSchema } from './ReturnableItemSchema'
import { ReturnableRequestWithRelationsSchema } from './ReturnableRequestSchema'

/////////////////////////////////////////
// ITEM RESERVATION SCHEMA
/////////////////////////////////////////

export const ItemReservationSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  requestId: z.string(),
})

export type ItemReservation = z.infer<typeof ItemReservationSchema>

/////////////////////////////////////////
// ITEM RESERVATION RELATION SCHEMA
/////////////////////////////////////////

export type ItemReservationRelations = {
  item: ReturnableItemWithRelations;
  request: ReturnableRequestWithRelations;
};

export type ItemReservationWithRelations = z.infer<typeof ItemReservationSchema> & ItemReservationRelations

export const ItemReservationWithRelationsSchema: z.ZodType<ItemReservationWithRelations> = ItemReservationSchema.merge(z.object({
  item: z.lazy(() => ReturnableItemWithRelationsSchema),
  request: z.lazy(() => ReturnableRequestWithRelationsSchema),
}))

export default ItemReservationSchema;
