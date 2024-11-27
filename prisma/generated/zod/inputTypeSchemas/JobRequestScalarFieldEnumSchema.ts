import { z } from 'zod';

export const JobRequestScalarFieldEnumSchema = z.enum(['id','description','location','startDate','endDate','costEstimate','actualCost','jobType','images','verifiedByReviewer','verifiedByRequester','rejectionCount','priority','requestId','status','assignedTo','isReassigned','createdAt','updatedAt']);

export default JobRequestScalarFieldEnumSchema;
