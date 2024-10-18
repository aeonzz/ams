import { z } from 'zod';

export const RequestScalarFieldEnumSchema = z.enum(['id','completedAt','createdAt','updatedAt','priority','type','title','rejectionReason','status','userId','departmentId','reviewedBy']);

export default RequestScalarFieldEnumSchema;
