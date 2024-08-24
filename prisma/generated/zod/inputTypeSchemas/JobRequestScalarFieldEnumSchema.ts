import { z } from 'zod';

export const JobRequestScalarFieldEnumSchema = z.enum(['id','notes','dueDate','jobType','category','name','assignTo','requestId']);

export default JobRequestScalarFieldEnumSchema;
