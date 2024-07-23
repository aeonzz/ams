import { z } from 'zod';

export const JobRequestScalarFieldEnumSchema = z.enum(['id','jobType','category','name','requestId']);

export default JobRequestScalarFieldEnumSchema;
