import { z } from 'zod';

export const InventorySubItemScalarFieldEnumSchema = z.enum(['id','inventoryId','subName','serialNumber','status','isArchived','createdAt','updatedAt']);

export default InventorySubItemScalarFieldEnumSchema;
