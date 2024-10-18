import { z } from 'zod';

export const DepartmentBorrowingPolicyScalarFieldEnumSchema = z.enum(['id','departmentId','maxBorrowDuration','penaltyBorrowBanDuration','other']);

export default DepartmentBorrowingPolicyScalarFieldEnumSchema;
