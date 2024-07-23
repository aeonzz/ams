import { z } from 'zod';

export const ResourceRequestScalarFieldEnumSchema = z.enum(['id','itemType','quantity','returnDate','requestId']);

export default ResourceRequestScalarFieldEnumSchema;
