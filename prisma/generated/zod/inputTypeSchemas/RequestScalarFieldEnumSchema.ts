import { z } from 'zod';

export const RequestScalarFieldEnumSchema = z.enum(['id','approvedAt','createdAt','updatedAt','priority','type','title','notes','status','userId','department']);

export default RequestScalarFieldEnumSchema;
