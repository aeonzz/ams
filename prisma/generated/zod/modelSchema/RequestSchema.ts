import { z } from 'zod';
import { PriorityTypeSchema } from '../inputTypeSchemas/PriorityTypeSchema'
import { RequestStatusTypeSchema } from '../inputTypeSchemas/RequestStatusTypeSchema'

/////////////////////////////////////////
// REQUEST SCHEMA
/////////////////////////////////////////

export const RequestSchema = z.object({
  priority: PriorityTypeSchema,
  status: RequestStatusTypeSchema,
  id: z.string(),
  approvedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  type: z.string(),
  notes: z.string(),
  userId: z.string(),
  department: z.string(),
})

export type Request = z.infer<typeof RequestSchema>

export default RequestSchema;
