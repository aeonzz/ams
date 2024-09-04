import { z } from 'zod';

export const InventoryItemScalarFieldEnumSchema = z.enum(['id','name','description','imageUrl','isArchived','createdAt','updatedAt','departmentId']);

export default InventoryItemScalarFieldEnumSchema;
