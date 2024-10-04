import { z } from 'zod';

export const JobRequestEvaluationScalarFieldEnumSchema = z.enum(['id','clientType','position','sex','age','regionOfResidence','awarenessLevel','visibility','helpfulness','surveyResponses','suggestions','jobRequestId','createdAt','updatedAt']);

export default JobRequestEvaluationScalarFieldEnumSchema;
