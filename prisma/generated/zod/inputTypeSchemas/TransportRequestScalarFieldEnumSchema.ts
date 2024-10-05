import { z } from 'zod';

export const TransportRequestScalarFieldEnumSchema = z.enum(['id','description','department','numberOfPassengers','passengersName','destination','inProgress','dateAndTimeNeeded','createdAt','updatedAt','requestId','vehicleId']);

export default TransportRequestScalarFieldEnumSchema;
