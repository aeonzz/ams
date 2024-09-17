import { z } from 'zod';

export const JobRequestScalarFieldEnumSchema = z.enum(['id','description','dueDate','estimatedTime','startDate','endDate','costEstimate','actualCost','jobType','progressNotes','requestId','sectionId','status','assignedTo','createdAt','updatedAt']);

export default JobRequestScalarFieldEnumSchema;
