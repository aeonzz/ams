import { z } from 'zod';

export const ItemTypeSchema = z.enum(['ELECTRONICS','FURNITURE','STATIONERY','VEHICLE','EQUIPMENT','BOOK','SOFTWARE','OTHER']);

export type ItemTypeType = `${z.infer<typeof ItemTypeSchema>}`

export default ItemTypeSchema;
