import { z } from 'zod';

export const ReturnableRequestScalarFieldEnumSchema = z.enum(['id','quantity','dateNeeded','returnDate','purpose','status','requestId','createdAt','updatedAt']);

export default ReturnableRequestScalarFieldEnumSchema;
