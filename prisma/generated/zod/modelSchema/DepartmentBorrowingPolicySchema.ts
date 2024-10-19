import { z } from 'zod';
import type { DepartmentWithRelations } from './DepartmentSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'

/////////////////////////////////////////
// DEPARTMENT BORROWING POLICY SCHEMA
/////////////////////////////////////////

export const DepartmentBorrowingPolicySchema = z.object({
  id: z.string(),
  departmentId: z.string(),
  maxBorrowDuration: z.number().int(),
  penaltyBorrowBanDuration: z.number().int().nullable(),
  gracePeriod: z.number().int(),
  other: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type DepartmentBorrowingPolicy = z.infer<typeof DepartmentBorrowingPolicySchema>

/////////////////////////////////////////
// DEPARTMENT BORROWING POLICY RELATION SCHEMA
/////////////////////////////////////////

export type DepartmentBorrowingPolicyRelations = {
  department: DepartmentWithRelations;
};

export type DepartmentBorrowingPolicyWithRelations = z.infer<typeof DepartmentBorrowingPolicySchema> & DepartmentBorrowingPolicyRelations

export const DepartmentBorrowingPolicyWithRelationsSchema: z.ZodType<DepartmentBorrowingPolicyWithRelations> = DepartmentBorrowingPolicySchema.merge(z.object({
  department: z.lazy(() => DepartmentWithRelationsSchema),
}))

export default DepartmentBorrowingPolicySchema;
