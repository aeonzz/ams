import { z } from 'zod';
import { VehicleStatusSchema } from '../inputTypeSchemas/VehicleStatusSchema'
import type { TransportRequestWithRelations } from './TransportRequestSchema'
import type { MaintenanceRecordWithRelations } from './MaintenanceRecordSchema'
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
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Vehicle = z.infer<typeof VehicleSchema>

/////////////////////////////////////////
// VEHICLE RELATION SCHEMA
/////////////////////////////////////////

export type VehicleRelations = {
  transportRequest: TransportRequestWithRelations[];
  maintenanceRecord: MaintenanceRecordWithRelations[];
};

export type VehicleWithRelations = z.infer<typeof VehicleSchema> & VehicleRelations

export const VehicleWithRelationsSchema: z.ZodType<VehicleWithRelations> = VehicleSchema.merge(z.object({
  transportRequest: z.lazy(() => TransportRequestWithRelationsSchema).array(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordWithRelationsSchema).array(),
}))

export default VehicleSchema;
