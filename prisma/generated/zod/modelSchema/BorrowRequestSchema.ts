import { z } from 'zod';

/////////////////////////////////////////
// BORROW REQUEST SCHEMA
/////////////////////////////////////////

export const BorrowRequestSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  itemType: z.string(),
  quantity: z.number().int(),
  returnDate: z.coerce.date(),
})

export type BorrowRequest = z.infer<typeof BorrowRequestSchema>

export default BorrowRequestSchema;
