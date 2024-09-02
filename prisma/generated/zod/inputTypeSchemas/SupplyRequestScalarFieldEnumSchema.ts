import { z } from 'zod';

export const SupplyRequestScalarFieldEnumSchema = z.enum(['id','quantity','dateAndTimeNeeded','purpose','requestId','createdAt','updatedAt']);

export default SupplyRequestScalarFieldEnumSchema;
