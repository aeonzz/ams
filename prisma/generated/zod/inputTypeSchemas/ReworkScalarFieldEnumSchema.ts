import { z } from 'zod';

export const ReworkScalarFieldEnumSchema = z.enum(['id','jobRequestId','reworkStartDate','reworkEndDate','status','rejectionReason','createdAt','updatedAt']);

export default ReworkScalarFieldEnumSchema;
