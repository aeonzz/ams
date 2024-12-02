import { z } from 'zod';

export const TransportRequestScalarFieldEnumSchema = z.enum(['id','description','departmentId','numberOfPassengers','passengersName','destination','inProgress','actualStart','dateAndTimeNeeded','odometerStart','odometerEnd','totalDistanceTravelled','createdAt','updatedAt','requestId','vehicleId']);

export default TransportRequestScalarFieldEnumSchema;
