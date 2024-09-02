import { z } from 'zod';

export const SupplyItemScalarFieldEnumSchema = z.enum(['id','name','description','status','imageUrl','quantity','unit','lowStockThreshold','expirationDate','category','createdAt','updatedAt','supplyRequestId']);

export default SupplyItemScalarFieldEnumSchema;
