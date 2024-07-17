import { z } from 'zod';

export const ResourceRequestScalarFieldEnumSchema = z.enum(['id','requestId','itemType','quantity','returnDate']);

export default ResourceRequestScalarFieldEnumSchema;
