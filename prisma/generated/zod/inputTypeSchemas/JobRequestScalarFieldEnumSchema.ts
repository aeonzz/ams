import { z } from 'zod';

export const JobRequestScalarFieldEnumSchema = z.enum(['id','notes','dueDate','jobType','requestId','sectionId','status','assignedTo','createdAt','updatedAt']);

export default JobRequestScalarFieldEnumSchema;
