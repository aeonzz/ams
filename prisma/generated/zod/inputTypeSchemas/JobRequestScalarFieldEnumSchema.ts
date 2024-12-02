import { z } from 'zod';

export const JobRequestScalarFieldEnumSchema = z.enum(['id','description','departmentId','location','startDate','endDate','jobType','proofImages','images','verifiedByReviewer','verifiedByRequester','rejectionCount','priority','requestId','status','assignedTo','isReassigned','createdAt','updatedAt']);

export default JobRequestScalarFieldEnumSchema;
