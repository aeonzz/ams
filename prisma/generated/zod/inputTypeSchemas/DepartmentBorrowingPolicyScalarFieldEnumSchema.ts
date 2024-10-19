import { z } from 'zod';

export const DepartmentBorrowingPolicyScalarFieldEnumSchema = z.enum(['id','departmentId','maxBorrowDuration','penaltyBorrowBanDuration','gracePeriod','other','createdAt','updatedAt']);

export default DepartmentBorrowingPolicyScalarFieldEnumSchema;
