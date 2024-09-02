import { z } from 'zod';

export const SupplyItemStatusSchema = z.enum(['IN_STOCK','LOW_STOCK','OUT_OF_STOCK','ORDERED','EXPIRED']);

export type SupplyItemStatusType = `${z.infer<typeof SupplyItemStatusSchema>}`

export default SupplyItemStatusSchema;
