import { z } from 'zod';
import { PriorityTypeSchema } from '../inputTypeSchemas/PriorityTypeSchema'
import { RequestTypeSchema } from '../inputTypeSchemas/RequestTypeSchema'
import { RequestStatusTypeSchema } from '../inputTypeSchemas/RequestStatusTypeSchema'
import type { UserWithRelations } from './UserSchema'
import type { DepartmentWithRelations } from './DepartmentSchema'
import type { JobRequestWithRelations } from './JobRequestSchema'
import type { VenueRequestWithRelations } from './VenueRequestSchema'
import type { ReturnableRequestWithRelations } from './ReturnableRequestSchema'
import type { SupplyRequestWithRelations } from './SupplyRequestSchema'
import type { TransportRequestWithRelations } from './TransportRequestSchema'
import { UserWithRelationsSchema } from './UserSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'
import { JobRequestWithRelationsSchema } from './JobRequestSchema'
import { VenueRequestWithRelationsSchema } from './VenueRequestSchema'
import { ReturnableRequestWithRelationsSchema } from './ReturnableRequestSchema'
import { SupplyRequestWithRelationsSchema } from './SupplyRequestSchema'
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
  departmentId: z.string(),
  reviewedBy: z.string().nullable(),
})

export type Request = z.infer<typeof RequestSchema>

/////////////////////////////////////////
// REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type RequestRelations = {
  user: UserWithRelations;
  department: DepartmentWithRelations;
  reviewer?: UserWithRelations | null;
  jobRequest?: JobRequestWithRelations | null;
  venueRequest?: VenueRequestWithRelations | null;
  returnableRequest?: ReturnableRequestWithRelations | null;
  supplyRequest?: SupplyRequestWithRelations | null;
  transportRequest?: TransportRequestWithRelations | null;
};

export type RequestWithRelations = z.infer<typeof RequestSchema> & RequestRelations

export const RequestWithRelationsSchema: z.ZodType<RequestWithRelations> = RequestSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  department: z.lazy(() => DepartmentWithRelationsSchema),
  reviewer: z.lazy(() => UserWithRelationsSchema).nullable(),
  jobRequest: z.lazy(() => JobRequestWithRelationsSchema).nullable(),
  venueRequest: z.lazy(() => VenueRequestWithRelationsSchema).nullable(),
  returnableRequest: z.lazy(() => ReturnableRequestWithRelationsSchema).nullable(),
  supplyRequest: z.lazy(() => SupplyRequestWithRelationsSchema).nullable(),
  transportRequest: z.lazy(() => TransportRequestWithRelationsSchema).nullable(),
}))

export default RequestSchema;
