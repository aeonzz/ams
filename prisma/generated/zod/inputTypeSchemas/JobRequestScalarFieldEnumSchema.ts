import { z } from 'zod';

export const JobRequestScalarFieldEnumSchema = z.enum(['id','description','location','dueDate','estimatedTime','startDate','endDate','costEstimate','actualCost','jobType','rejectionCount','priority','requestId','status','assignedTo','createdAt','updatedAt']);

export default JobRequestScalarFieldEnumSchema;
