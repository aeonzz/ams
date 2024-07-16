import { z } from 'zod';

export const RequestScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','type','status','userId','department']);

export default RequestScalarFieldEnumSchema;
