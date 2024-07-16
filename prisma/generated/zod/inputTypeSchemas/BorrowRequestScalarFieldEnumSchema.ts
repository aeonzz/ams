import { z } from 'zod';

export const BorrowRequestScalarFieldEnumSchema = z.enum(['id','requestId','itemType','quantity','returnDate']);

export default BorrowRequestScalarFieldEnumSchema;
