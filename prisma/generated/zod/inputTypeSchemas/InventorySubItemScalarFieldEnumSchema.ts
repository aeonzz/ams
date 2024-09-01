import { z } from 'zod';

export const InventorySubItemScalarFieldEnumSchema = z.enum(['id','inventoryId','status','isArchived','createdAt','updatedAt']);

export default InventorySubItemScalarFieldEnumSchema;
