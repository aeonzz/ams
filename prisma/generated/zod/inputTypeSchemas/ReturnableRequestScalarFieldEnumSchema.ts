import { z } from 'zod';

export const ReturnableRequestScalarFieldEnumSchema = z.enum(['id','itemId','dateAndTimeNeeded','inProgress','returnDateAndTime','isOverdue','actualReturnDate','isReturned','returnCondition','purpose','location','notes','requestId','createdAt','updatedAt']);

export default ReturnableRequestScalarFieldEnumSchema;
