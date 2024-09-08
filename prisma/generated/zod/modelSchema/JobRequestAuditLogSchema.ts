import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'
import { ChangeTypeSchema } from '../inputTypeSchemas/ChangeTypeSchema'
import type { JsonValueType } from '../inputTypeSchemas/JsonValueSchema';
import type { JobRequestWithRelations } from './JobRequestSchema'
import type { UserWithRelations } from './UserSchema'
import { JobRequestWithRelationsSchema } from './JobRequestSchema'
import { UserWithRelationsSchema } from './UserSchema'

/////////////////////////////////////////
// JOB REQUEST AUDIT LOG SCHEMA
/////////////////////////////////////////

export const JobRequestAuditLogSchema = z.object({
  changeType: ChangeTypeSchema,
  id: z.string(),
  jobRequestId: z.string(),
  oldValue: JsonValueSchema.nullable(),
  newValue: JsonValueSchema.nullable(),
  changedById: z.string(),
  timestamp: z.coerce.date(),
})

export type JobRequestAuditLog = z.infer<typeof JobRequestAuditLogSchema>

/////////////////////////////////////////
// JOB REQUEST AUDIT LOG RELATION SCHEMA
/////////////////////////////////////////

export type JobRequestAuditLogRelations = {
  jobRequest: JobRequestWithRelations;
  changedBy: UserWithRelations;
};

export type JobRequestAuditLogWithRelations = Omit<z.infer<typeof JobRequestAuditLogSchema>, "oldValue" | "newValue"> & {
  oldValue?: JsonValueType | null;
  newValue?: JsonValueType | null;
} & JobRequestAuditLogRelations

export const JobRequestAuditLogWithRelationsSchema: z.ZodType<JobRequestAuditLogWithRelations> = JobRequestAuditLogSchema.merge(z.object({
  jobRequest: z.lazy(() => JobRequestWithRelationsSchema),
  changedBy: z.lazy(() => UserWithRelationsSchema),
}))

export default JobRequestAuditLogSchema;
