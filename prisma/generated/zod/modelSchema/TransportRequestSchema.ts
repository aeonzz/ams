import { z } from 'zod';
import type { RequestWithRelations } from './RequestSchema'
import type { VehicleWithRelations } from './VehicleSchema'
import { RequestWithRelationsSchema } from './RequestSchema'
import { VehicleWithRelationsSchema } from './VehicleSchema'

/////////////////////////////////////////
// TRANSPORT REQUEST SCHEMA
/////////////////////////////////////////

export const TransportRequestSchema = z.object({
  id: z.string(),
  description: z.string(),
  department: z.string(),
  numberOfPassengers: z.number().int(),
  passengersName: z.string().array(),
  destination: z.string(),
  dateAndTimeNeeded: z.coerce.date(),
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
  request: RequestWithRelations;
  vehicle: VehicleWithRelations;
};

export type TransportRequestWithRelations = z.infer<typeof TransportRequestSchema> & TransportRequestRelations

export const TransportRequestWithRelationsSchema: z.ZodType<TransportRequestWithRelations> = TransportRequestSchema.merge(z.object({
  request: z.lazy(() => RequestWithRelationsSchema),
  vehicle: z.lazy(() => VehicleWithRelationsSchema),
}))

export default TransportRequestSchema;
