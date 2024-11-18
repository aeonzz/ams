import { z } from 'zod';

export const TransportRequestScalarFieldEnumSchema = z.enum(['id','description','department','numberOfPassengers','passengersName','destination','inProgress','actualStart','dateAndTimeNeeded','odometerStart','odometerEnd','totalDistanceTravelled','createdAt','updatedAt','requestId','vehicleId']);

export default TransportRequestScalarFieldEnumSchema;
