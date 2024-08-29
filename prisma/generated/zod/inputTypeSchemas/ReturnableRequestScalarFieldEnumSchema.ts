import { z } from 'zod';

export const ReturnableRequestScalarFieldEnumSchema = z.enum(['id','dateNeeded','returnDate','purpose','status','requestId','createdAt','updatedAt']);

export default ReturnableRequestScalarFieldEnumSchema;
