import { z } from 'zod';

export const ItemCategoryScalarFieldEnumSchema = z.enum(['id','name','label','createdAt']);

export default ItemCategoryScalarFieldEnumSchema;
