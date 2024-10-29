import { z } from 'zod';

export const VenueRequestScalarFieldEnumSchema = z.enum(['id','notes','purpose','setupRequirements','startTime','endTime','actualEndtime','inProgress','requestId','venueId','createdAt','updatedAt']);

export default VenueRequestScalarFieldEnumSchema;
