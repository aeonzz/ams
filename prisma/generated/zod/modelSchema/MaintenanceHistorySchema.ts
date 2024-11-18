import { z } from 'zod';
import type { VehicleWithRelations } from './VehicleSchema'
import { VehicleWithRelationsSchema } from './VehicleSchema'

/////////////////////////////////////////
// MAINTENANCE HISTORY SCHEMA
/////////////////////////////////////////

export const MaintenanceHistorySchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  performedAt: z.coerce.date(),
  odometer: z.number(),
  description: z.string().nullable(),
  createdAt: z.coerce.date(),
})

export type MaintenanceHistory = z.infer<typeof MaintenanceHistorySchema>

/////////////////////////////////////////
// MAINTENANCE HISTORY RELATION SCHEMA
/////////////////////////////////////////

export type MaintenanceHistoryRelations = {
  vehicle: VehicleWithRelations;
};

export type MaintenanceHistoryWithRelations = z.infer<typeof MaintenanceHistorySchema> & MaintenanceHistoryRelations

export const MaintenanceHistoryWithRelationsSchema: z.ZodType<MaintenanceHistoryWithRelations> = MaintenanceHistorySchema.merge(z.object({
  vehicle: z.lazy(() => VehicleWithRelationsSchema),
}))

export default MaintenanceHistorySchema;
