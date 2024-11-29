import { z } from 'zod';

export const VenueRequestScalarFieldEnumSchema = z.enum(['id','department','notes','purpose','setupRequirements','startTime','endTime','actualStart','inProgress','requestId','venueId','createdAt','updatedAt']);

export default VenueRequestScalarFieldEnumSchema;
