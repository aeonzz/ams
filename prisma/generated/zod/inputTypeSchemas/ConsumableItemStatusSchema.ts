import { z } from 'zod';

export const ConsumableItemStatusSchema = z.enum(['IN_STOCK','LOW_STOCK','OUT_OF_STOCK','ORDERED','EXPIRED']);

export type ConsumableItemStatusType = `${z.infer<typeof ConsumableItemStatusSchema>}`

export default ConsumableItemStatusSchema;
