import { z } from 'zod';

export const ReturnableRequestScalarFieldEnumSchema = z.enum(['id','itemId','dateAndTimeNeeded','returnDateAndTime','purpose','status','requestId','createdAt','updatedAt']);

export default ReturnableRequestScalarFieldEnumSchema;
