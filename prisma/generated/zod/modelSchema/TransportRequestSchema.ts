import { z } from 'zod';
import type { DepartmentWithRelations } from './DepartmentSchema'
import type { RequestWithRelations } from './RequestSchema'
import type { VehicleWithRelations } from './VehicleSchema'
import { DepartmentWithRelationsSchema } from './DepartmentSchema'
import { RequestWithRelationsSchema } from './RequestSchema'
import { VehicleWithRelationsSchema } from './VehicleSchema'

/////////////////////////////////////////
// TRANSPORT REQUEST SCHEMA
/////////////////////////////////////////

export const TransportRequestSchema = z.object({
  id: z.string(),
  description: z.string(),
  departmentId: z.string(),
  numberOfPassengers: z.number().int(),
  passengersName: z.string().array(),
  destination: z.string(),
  inProgress: z.boolean(),
  actualStart: z.coerce.date().nullable(),
  dateAndTimeNeeded: z.coerce.date(),
  odometerStart: z.number().nullable(),
  odometerEnd: z.number().nullable(),
  totalDistanceTravelled: z.number().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  requestId: z.string(),
  vehicleId: z.string(),
})

export type TransportRequest = z.infer<typeof TransportRequestSchema>

/////////////////////////////////////////
// TRANSPORT REQUEST RELATION SCHEMA
/////////////////////////////////////////

export type TransportRequestRelations = {
  department: DepartmentWithRelations;
  request: RequestWithRelations;
  vehicle: VehicleWithRelations;
};

export type TransportRequestWithRelations = z.infer<typeof TransportRequestSchema> & TransportRequestRelations

export const TransportRequestWithRelationsSchema: z.ZodType<TransportRequestWithRelations> = TransportRequestSchema.merge(z.object({
  department: z.lazy(() => DepartmentWithRelationsSchema),
  request: z.lazy(() => RequestWithRelationsSchema),
  vehicle: z.lazy(() => VehicleWithRelationsSchema),
}))

export default TransportRequestSchema;
