import { z } from 'zod';
import { PriorityTypeSchema } from '../inputTypeSchemas/PriorityTypeSchema'

/////////////////////////////////////////
// REQUEST SCHEMA
/////////////////////////////////////////

export const RequestSchema = z.object({
  priority: PriorityTypeSchema,
  id: z.string(),
  approvedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  type: z.string(),
  notes: z.string(),
  status: z.string(),
  userId: z.string(),
  department: z.string(),
})

export type Request = z.infer<typeof RequestSchema>

export default RequestSchema;
