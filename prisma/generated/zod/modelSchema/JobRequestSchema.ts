import { z } from 'zod';
import { JobTypeSchema } from '../inputTypeSchemas/JobTypeSchema'
import { PriorityTypeSchema } from '../inputTypeSchemas/PriorityTypeSchema'
import { JobStatusSchema } from '../inputTypeSchemas/JobStatusSchema'
import type { FileWithRelations } from './FileSchema'
import type { ReworkWithRelations } from './ReworkSchema'
import type { RequestWithRelations } from './RequestSchema'
import type { UserWithRelations } from './UserSchema'
import type { JobRequestEvaluationWithRelations } from './JobRequestEvaluationSchema'
import { FileWithRelationsSchema } from './FileSchema'
import { ReworkWithRelationsSchema } from './ReworkSchema'
import { RequestWithRelationsSchema } from './RequestSchema'
import { UserWithRelationsSchema } from './UserSchema'
import { JobRequestEvaluationWithRelationsSchema } from './JobRequestEvaluationSchema'

/////////////////////////////////////////
// JOB REQUEST SCHEMA
/////////////////////////////////////////

export const JobRequestSchema = z.object({
  jobType: JobTypeSchema,
  priority: PriorityTypeSchema,
  status: JobStatusSchema,
  id: z.string(),
  description: z.string(),
  location: z.string(),
  dueDate: z.coerce.date(),
  estimatedTime: z.number().int().nullable(),
  startDate: z.coerce.date().nullable(),
  endDate: z.coerce.date().nullable(),
  costEstimate: z.number().nullable(),
  actualCost: z.number().nullable(),
  requestId: z.string(),
  assignedTo: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type JobRequest = z.infer<typeof JobRequestSchema>

/////////////////////////////////////////
// JOB REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type JobRequestRelations = {
  files: FileWithRelations[];
  reworkAttempts: ReworkWithRelations[];
  request: RequestWithRelations;
  assignedUser?: UserWithRelations | null;
  jobRequestEvaluation?: JobRequestEvaluationWithRelations | null;
};

export type JobRequestWithRelations = z.infer<typeof JobRequestSchema> & JobRequestRelations

export const JobRequestWithRelationsSchema: z.ZodType<JobRequestWithRelations> = JobRequestSchema.merge(z.object({
  files: z.lazy(() => FileWithRelationsSchema).array(),
  reworkAttempts: z.lazy(() => ReworkWithRelationsSchema).array(),
  request: z.lazy(() => RequestWithRelationsSchema),
  assignedUser: z.lazy(() => UserWithRelationsSchema).nullable(),
  jobRequestEvaluation: z.lazy(() => JobRequestEvaluationWithRelationsSchema).nullable(),
}))

export default JobRequestSchema;
