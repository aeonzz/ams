import { z } from 'zod';

export const JobRequestScalarFieldEnumSchema = z.enum(['id','notes','dueDate','jobType','assignTo','requestId']);

export default JobRequestScalarFieldEnumSchema;
