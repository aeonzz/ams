import { z } from 'zod';

export const SupplyItemCategoryScalarFieldEnumSchema = z.enum(['id','name','createdAt','isArchived','updatedAt']);

export default SupplyItemCategoryScalarFieldEnumSchema;
