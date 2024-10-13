import { z } from 'zod';
import { DepartmentTypeSchema } from '../inputTypeSchemas/DepartmentTypeSchema'
import type { UserRoleWithRelations } from './UserRoleSchema'
import type { InventoryItemWithRelations } from './InventoryItemSchema'
import type { ReturnableRequestWithRelations } from './ReturnableRequestSchema'
import type { UserDepartmentWithRelations } from './UserDepartmentSchema'
import type { RequestWithRelations } from './RequestSchema'
import type { VenueWithRelations } from './VenueSchema'
import type { VehicleWithRelations } from './VehicleSchema'
import { UserRoleWithRelationsSchema } from './UserRoleSchema'
import { InventoryItemWithRelationsSchema } from './InventoryItemSchema'
import { ReturnableRequestWithRelationsSchema } from './ReturnableRequestSchema'
import { UserDepartmentWithRelationsSchema } from './UserDepartmentSchema'
import { RequestWithRelationsSchema } from './RequestSchema'
import { VenueWithRelationsSchema } from './VenueSchema'
import { VehicleWithRelationsSchema } from './VehicleSchema'

/////////////////////////////////////////
// DEPARTMENT SCHEMA
/////////////////////////////////////////

export const DepartmentSchema = z.object({
  departmentType: DepartmentTypeSchema,
  id: z.string(),
  description: z.string().nullable(),
  name: z.string(),
  acceptsJobs: z.boolean(),
  managesTransport: z.boolean(),
  managesBorrowRequest: z.boolean(),
  managesSupplyRequest: z.boolean(),
  managesFacility: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  responsibilities: z.string().nullable(),
  isArchived: z.boolean(),
})

export type Department = z.infer<typeof DepartmentSchema>

/////////////////////////////////////////
// DEPARTMENT RELATION SCHEMA
/////////////////////////////////////////

export type DepartmentRelations = {
  userRole: UserRoleWithRelations[];
  inventoryItem: InventoryItemWithRelations[];
  returnableRequest: ReturnableRequestWithRelations[];
  userDepartments: UserDepartmentWithRelations[];
  request: RequestWithRelations[];
  venue: VenueWithRelations[];
  vehicle: VehicleWithRelations[];
};

export type DepartmentWithRelations = z.infer<typeof DepartmentSchema> & DepartmentRelations

export const DepartmentWithRelationsSchema: z.ZodType<DepartmentWithRelations> = DepartmentSchema.merge(z.object({
  userRole: z.lazy(() => UserRoleWithRelationsSchema).array(),
  inventoryItem: z.lazy(() => InventoryItemWithRelationsSchema).array(),
  returnableRequest: z.lazy(() => ReturnableRequestWithRelationsSchema).array(),
  userDepartments: z.lazy(() => UserDepartmentWithRelationsSchema).array(),
  request: z.lazy(() => RequestWithRelationsSchema).array(),
  venue: z.lazy(() => VenueWithRelationsSchema).array(),
  vehicle: z.lazy(() => VehicleWithRelationsSchema).array(),
}))

export default DepartmentSchema;
