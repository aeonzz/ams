import { z } from 'zod';
import type { UserRoleWithRelations } from './UserRoleSchema'
import type { InventoryItemWithRelations } from './InventoryItemSchema'
import type { ReturnableRequestWithRelations } from './ReturnableRequestSchema'
import type { UserWithRelations } from './UserSchema'
import type { RequestWithRelations } from './RequestSchema'
import { UserRoleWithRelationsSchema } from './UserRoleSchema'
import { InventoryItemWithRelationsSchema } from './InventoryItemSchema'
import { ReturnableRequestWithRelationsSchema } from './ReturnableRequestSchema'
import { UserWithRelationsSchema } from './UserSchema'
import { RequestWithRelationsSchema } from './RequestSchema'

/////////////////////////////////////////
// DEPARTMENT SCHEMA
/////////////////////////////////////////

export const DepartmentSchema = z.object({
  id: z.string(),
  label: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Department = z.infer<typeof DepartmentSchema>

/////////////////////////////////////////
// DEPARTMENT RELATION SCHEMA
/////////////////////////////////////////

export type DepartmentRelations = {
  userRole: UserRoleWithRelations[];
  inventoryItem: InventoryItemWithRelations[];
  returnableRequest: ReturnableRequestWithRelations[];
  user: UserWithRelations[];
  request: RequestWithRelations[];
};

export type DepartmentWithRelations = z.infer<typeof DepartmentSchema> & DepartmentRelations

export const DepartmentWithRelationsSchema: z.ZodType<DepartmentWithRelations> = DepartmentSchema.merge(z.object({
  userRole: z.lazy(() => UserRoleWithRelationsSchema).array(),
  inventoryItem: z.lazy(() => InventoryItemWithRelationsSchema).array(),
  returnableRequest: z.lazy(() => ReturnableRequestWithRelationsSchema).array(),
  user: z.lazy(() => UserWithRelationsSchema).array(),
  request: z.lazy(() => RequestWithRelationsSchema).array(),
}))

export default DepartmentSchema;
