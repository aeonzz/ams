import { z } from 'zod';

export const SupplyRequestItemScalarFieldEnumSchema = z.enum(['id','supplyRequestId','supplyItemId','quantity','createdAt','updatedAt']);

export default SupplyRequestItemScalarFieldEnumSchema;
