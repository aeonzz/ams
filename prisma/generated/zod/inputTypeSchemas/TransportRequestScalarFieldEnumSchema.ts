import { z } from 'zod';

export const TransportRequestScalarFieldEnumSchema = z.enum(['id','description','destination','dateAndTimeNeeded','createdAt','updatedAt','requestId','vehicleId']);

export default TransportRequestScalarFieldEnumSchema;
