import { z } from 'zod';

export const JobRequestScalarFieldEnumSchema = z.enum(['id','requestId','jobType','category','name']);

export default JobRequestScalarFieldEnumSchema;
