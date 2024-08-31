import { z } from 'zod';

export const InventoryItemScalarFieldEnumSchema = z.enum(['id','returnableItemId','status','createdAt','updatedAt']);

export default InventoryItemScalarFieldEnumSchema;
