import { z } from 'zod';

export const InventoryItemScalarFieldEnumSchema = z.enum(['id','name','description','imageUrl','isArchived','createdAt','updatedAt']);

export default InventoryItemScalarFieldEnumSchema;
