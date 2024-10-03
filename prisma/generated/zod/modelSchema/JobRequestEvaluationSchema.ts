import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'
import { ClientTypeSchema } from '../inputTypeSchemas/ClientTypeSchema'

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
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type JobRequestEvaluation = z.infer<typeof JobRequestEvaluationSchema>

export default JobRequestEvaluationSchema;
