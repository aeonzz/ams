import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'
import { ClientTypeSchema } from '../inputTypeSchemas/ClientTypeSchema'
import type { JobRequestWithRelations } from './JobRequestSchema'
import { JobRequestWithRelationsSchema } from './JobRequestSchema'

/////////////////////////////////////////
// JOB REQUEST EVALUATION SCHEMA
/////////////////////////////////////////

export const JobRequestEvaluationSchema = z.object({
  clientType: ClientTypeSchema,
  id: z.string(),
  position: z.string(),
  sex: z.string(),
  age: z.number().int(),
  regionOfResidence: z.string(),
  awarenessLevel: z.string(),
  visibility: z.string().nullable(),
  helpfulness: z.string().nullable(),
  surveyResponses: JsonValueSchema,
  suggestions: z.string().nullable(),
  jobRequestId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type JobRequestEvaluation = z.infer<typeof JobRequestEvaluationSchema>

/////////////////////////////////////////
// JOB REQUEST EVALUATION RELATION SCHEMA
/////////////////////////////////////////

export type JobRequestEvaluationRelations = {
  jobRequest: JobRequestWithRelations;
};

export type JobRequestEvaluationWithRelations = z.infer<typeof JobRequestEvaluationSchema> & JobRequestEvaluationRelations

export const JobRequestEvaluationWithRelationsSchema: z.ZodType<JobRequestEvaluationWithRelations> = JobRequestEvaluationSchema.merge(z.object({
  jobRequest: z.lazy(() => JobRequestWithRelationsSchema),
}))

export default JobRequestEvaluationSchema;
