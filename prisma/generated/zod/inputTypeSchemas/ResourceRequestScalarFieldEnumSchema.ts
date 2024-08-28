import { z } from 'zod';

export const ResourceRequestScalarFieldEnumSchema = z.enum(['id','quantity','dateNeeded','returnDate','purpose','requestId','createdAt','updatedAt']);

export default ResourceRequestScalarFieldEnumSchema;
