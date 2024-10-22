import { z } from 'zod';

export const SupplyItemScalarFieldEnumSchema = z.enum(['id','name','description','status','imageUrl','quantity','unit','lowStockThreshold','expirationDate','categoryId','departmentId','createdAt','isArchived','updatedAt']);

export default SupplyItemScalarFieldEnumSchema;
