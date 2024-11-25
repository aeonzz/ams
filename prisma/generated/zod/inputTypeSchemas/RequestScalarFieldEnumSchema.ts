import { z } from 'zod';

export const RequestScalarFieldEnumSchema = z.enum(['id','completedAt','createdAt','updatedAt','priority','type','title','rejectionReason','cancellationReason','onHoldReason','isUrgent','status','userId','departmentId','reviewedBy']);

export default RequestScalarFieldEnumSchema;
