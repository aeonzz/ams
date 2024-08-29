import { z } from 'zod';

export const ReturnableItemScalarFieldEnumSchema = z.enum(['id','name','description','status','imageUrl','serialNumber','lastMaintenance','createdAt','updatedAt']);

export default ReturnableItemScalarFieldEnumSchema;