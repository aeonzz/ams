import { z } from 'zod';

export const TransportRequestScalarFieldEnumSchema = z.enum(['id','description','department','numberOfPassengers','passengersName','destination','dateAndTimeNeeded','createdAt','updatedAt','requestId','vehicleId']);

export default TransportRequestScalarFieldEnumSchema;
