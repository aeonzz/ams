import { z } from 'zod';

export const ReturnableItemScalarFieldEnumSchema = z.enum(['id','name','description','imageUrl','createdAt','updatedAt']);

export default ReturnableItemScalarFieldEnumSchema;
