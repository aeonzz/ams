import { z } from 'zod';

export const RequestScalarFieldEnumSchema = z.enum(['id','approvedAt','createdAt','updatedAt','priority','type','title','cancellationReason','status','userId','departmentId','reviewedBy']);

export default RequestScalarFieldEnumSchema;
