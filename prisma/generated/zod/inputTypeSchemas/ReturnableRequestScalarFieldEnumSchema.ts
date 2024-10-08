import { z } from 'zod';

export const ReturnableRequestScalarFieldEnumSchema = z.enum(['id','itemId','dateAndTimeNeeded','returnDateAndTime','purpose','quantity','requestId','createdAt','updatedAt','departmentId']);

export default ReturnableRequestScalarFieldEnumSchema;
