import { z } from 'zod';

/////////////////////////////////////////
// REQUEST SCHEMA
/////////////////////////////////////////

export const RequestSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  type: z.string(),
  status: z.string(),
  userId: z.string(),
  department: z.string(),
})

export type Request = z.infer<typeof RequestSchema>

export default RequestSchema;
