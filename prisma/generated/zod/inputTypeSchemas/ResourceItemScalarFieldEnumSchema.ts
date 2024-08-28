import { z } from 'zod';

export const ResourceItemScalarFieldEnumSchema = z.enum(['id','name','description','itemType','quantity','status','imageUrl','createdAt','updatedAt']);

export default ResourceItemScalarFieldEnumSchema;
