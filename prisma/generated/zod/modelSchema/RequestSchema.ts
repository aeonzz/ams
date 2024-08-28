import { z } from 'zod';
import { PriorityTypeSchema } from '../inputTypeSchemas/PriorityTypeSchema'
import { RequestTypeSchema } from '../inputTypeSchemas/RequestTypeSchema'
import { RequestStatusTypeSchema } from '../inputTypeSchemas/RequestStatusTypeSchema'
import type { UserWithRelations } from './UserSchema'
import type { JobRequestWithRelations } from './JobRequestSchema'
import type { VenueRequestWithRelations } from './VenueRequestSchema'
import type { ReturnableRequestWithRelations } from './ReturnableRequestSchema'
import type { ConsumableRequestWithRelations } from './ConsumableRequestSchema'
import type { TransportRequestWithRelations } from './TransportRequestSchema'
import { UserWithRelationsSchema } from './UserSchema'
import { JobRequestWithRelationsSchema } from './JobRequestSchema'
import { VenueRequestWithRelationsSchema } from './VenueRequestSchema'
import { ReturnableRequestWithRelationsSchema } from './ReturnableRequestSchema'
import { ConsumableRequestWithRelationsSchema } from './ConsumableRequestSchema'
import { TransportRequestWithRelationsSchema } from './TransportRequestSchema'

/////////////////////////////////////////
// REQUEST SCHEMA
/////////////////////////////////////////

export const RequestSchema = z.object({
  priority: PriorityTypeSchema,
  type: RequestTypeSchema,
  status: RequestStatusTypeSchema,
  id: z.string(),
  approvedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  title: z.string(),
  userId: z.string(),
  department: z.string(),
})

export type Request = z.infer<typeof RequestSchema>

/////////////////////////////////////////
// REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type RequestRelations = {
  user: UserWithRelations;
  jobRequest?: JobRequestWithRelations | null;
  venueRequest?: VenueRequestWithRelations | null;
  ReturnableRequest?: ReturnableRequestWithRelations | null;
  ConsumableRequest?: ConsumableRequestWithRelations | null;
  transportRequest?: TransportRequestWithRelations | null;
};

export type RequestWithRelations = z.infer<typeof RequestSchema> & RequestRelations

export const RequestWithRelationsSchema: z.ZodType<RequestWithRelations> = RequestSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  jobRequest: z.lazy(() => JobRequestWithRelationsSchema).nullable(),
  venueRequest: z.lazy(() => VenueRequestWithRelationsSchema).nullable(),
  ReturnableRequest: z.lazy(() => ReturnableRequestWithRelationsSchema).nullable(),
  ConsumableRequest: z.lazy(() => ConsumableRequestWithRelationsSchema).nullable(),
  transportRequest: z.lazy(() => TransportRequestWithRelationsSchema).nullable(),
}))

export default RequestSchema;
