import { z } from 'zod';
import { VehicleStatusSchema } from '../inputTypeSchemas/VehicleStatusSchema'
import type { DepartmentWithRelations } from './DepartmentSchema'
import type { TransportRequestWithRelations } from './TransportRequestSchema'
import type { MaintenanceHistoryWithRelations } from './MaintenanceHistorySchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'
import { TransportRequestWithRelationsSchema } from './TransportRequestSchema'
import { MaintenanceHistoryWithRelationsSchema } from './MaintenanceHistorySchema'

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
  odometer: z.number(),
  maintenanceInterval: z.number(),
  requiresMaintenance: z.boolean(),
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
  maintenanceHistory: MaintenanceHistoryWithRelations[];
};

export type VehicleWithRelations = z.infer<typeof VehicleSchema> & VehicleRelations

export const VehicleWithRelationsSchema: z.ZodType<VehicleWithRelations> = VehicleSchema.merge(z.object({
  department: z.lazy(() => DepartmentWithRelationsSchema),
  transportRequest: z.lazy(() => TransportRequestWithRelationsSchema).array(),
  maintenanceHistory: z.lazy(() => MaintenanceHistoryWithRelationsSchema).array(),
}))

export default VehicleSchema;
