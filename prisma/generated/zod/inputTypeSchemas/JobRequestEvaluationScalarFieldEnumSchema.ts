import { z } from 'zod';

export const JobRequestEvaluationScalarFieldEnumSchema = z.enum(['id','clientType','position','sex','age','regionOfResidence','awarenessLevel','visibility','helpfulness','surveyResponses','suggestions','createdAt','updatedAt']);

export default JobRequestEvaluationScalarFieldEnumSchema;
