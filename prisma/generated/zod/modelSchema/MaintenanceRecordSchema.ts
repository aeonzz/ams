import { z } from 'zod';
import type { VehicleWithRelations } from './VehicleSchema'
import { VehicleWithRelationsSchema } from './VehicleSchema'

/////////////////////////////////////////
// MAINTENANCE RECORD SCHEMA
/////////////////////////////////////////

export const MaintenanceRecordSchema = z.object({
  id: z.string(),
  date: z.coerce.date(),
  details: z.string(),
  vehicleId: z.string(),
})

export type MaintenanceRecord = z.infer<typeof MaintenanceRecordSchema>

/////////////////////////////////////////
// MAINTENANCE RECORD RELATION SCHEMA
/////////////////////////////////////////

export type MaintenanceRecordRelations = {
  vehicle: VehicleWithRelations;
};

export type MaintenanceRecordWithRelations = z.infer<typeof MaintenanceRecordSchema> & MaintenanceRecordRelations

export const MaintenanceRecordWithRelationsSchema: z.ZodType<MaintenanceRecordWithRelations> = MaintenanceRecordSchema.merge(z.object({
  vehicle: z.lazy(() => VehicleWithRelationsSchema),
}))

export default MaintenanceRecordSchema;
