import { z } from 'zod';

export const VenueRequestScalarFieldEnumSchema = z.enum(['id','notes','purpose','setupRequirements','startTime','endTime','actualEndtime','inProgress','requestId','venueId']);

export default VenueRequestScalarFieldEnumSchema;
