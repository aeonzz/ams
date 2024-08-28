import { z } from 'zod';

export const ConsumableItemScalarFieldEnumSchema = z.enum(['id','name','description','status','imageUrl','quantity','unit','lowStockThreshold','expirationDate','createdAt','updatedAt','consumableRequestId']);

export default ConsumableItemScalarFieldEnumSchema;
