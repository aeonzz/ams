import { z } from 'zod';

export const InventorySubItemScalarFieldEnumSchema = z.enum(['id','imageUrl','subName','serialNumber','inventoryId','status','isArchived','createdAt','updatedAt']);

export default InventorySubItemScalarFieldEnumSchema;
