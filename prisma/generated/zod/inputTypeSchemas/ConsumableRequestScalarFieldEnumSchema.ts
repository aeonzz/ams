import { z } from 'zod';

export const ConsumableRequestScalarFieldEnumSchema = z.enum(['id','quantity','dateNeeded','purpose','status','requestId','createdAt','updatedAt']);

export default ConsumableRequestScalarFieldEnumSchema;
