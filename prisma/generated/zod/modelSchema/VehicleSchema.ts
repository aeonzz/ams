import { z } from 'zod';
import { VehicleStatusSchema } from '../inputTypeSchemas/VehicleStatusSchema'
import type { DepartmentWithRelations } from './DepartmentSchema'
import type { TransportRequestWithRelations } from './TransportRequestSchema'
import type { MaintenanceRecordWithRelations } from './MaintenanceRecordSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'
import { TransportRequestWithRelationsSchema } from './TransportRequestSchema'
import { MaintenanceRecordWithRelationsSchema } from './MaintenanceRecordSchema'

/////////////////////////////////////////
// VEHICLE SCHEMA
/////////////////////////////////////////

export const VehicleSchema = z.object({
  status: VehicleStatusSchema,
  id: z.string(),
  name: z.string(),
  type: z.string(),
  imageUrl: z.string(),
  capacity: z.number().int(),
  licensePlate: z.string(),
  isArchived: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  departmentId: z.string(),
})

export type Vehicle = z.infer<typeof VehicleSchema>

/////////////////////////////////////////
// VEHICLE RELATION SCHEMA
/////////////////////////////////////////

export type VehicleRelations = {
  department: DepartmentWithRelations;
  transportRequest: TransportRequestWithRelations[];
  maintenanceRecord: MaintenanceRecordWithRelations[];
};

export type VehicleWithRelations = z.infer<typeof VehicleSchema> & VehicleRelations

export const VehicleWithRelationsSchema: z.ZodType<VehicleWithRelations> = VehicleSchema.merge(z.object({
  department: z.lazy(() => DepartmentWithRelationsSchema),
  transportRequest: z.lazy(() => TransportRequestWithRelationsSchema).array(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordWithRelationsSchema).array(),
}))

export default VehicleSchema;
