import { z } from 'zod';

export const VenueRequestScalarFieldEnumSchema = z.enum(['id','notes','purpose','venueName','setupRequirements','startTime','endTime','requestId']);

export default VenueRequestScalarFieldEnumSchema;
