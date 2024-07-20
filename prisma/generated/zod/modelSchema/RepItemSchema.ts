import { z } from 'zod';

/////////////////////////////////////////
// REP ITEM SCHEMA
/////////////////////////////////////////

export const RepItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  itemCategory: z.string(),
  brand: z.string().nullable(),
  model: z.string().nullable(),
  serialNumber: z.string().nullable(),
  issueDescription: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type RepItem = z.infer<typeof RepItemSchema>

export default RepItemSchema;
