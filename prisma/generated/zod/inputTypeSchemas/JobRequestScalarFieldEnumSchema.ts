import { z } from 'zod';

export const JobRequestScalarFieldEnumSchema = z.enum(['id','jobType','category','name','assignTo','requestId']);

export default JobRequestScalarFieldEnumSchema;
