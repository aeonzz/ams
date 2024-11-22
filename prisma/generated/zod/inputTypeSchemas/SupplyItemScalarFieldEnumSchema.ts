import { z } from 'zod';

export const SupplyItemScalarFieldEnumSchema = z.enum(['id','name','stockNumber','unitValue','total','location','description','status','imageUrl','quantity','unit','lowStockThreshold','expirationDate','categoryId','departmentId','createdAt','isArchived','updatedAt']);

export default SupplyItemScalarFieldEnumSchema;
