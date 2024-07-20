import { z } from 'zod';

export const RepItemScalarFieldEnumSchema = z.enum(['id','name','itemCategory','brand','model','serialNumber','issueDescription','createdAt','updatedAt']);

export default RepItemScalarFieldEnumSchema;
