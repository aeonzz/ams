import { z } from 'zod';

export const VenueRequestScalarFieldEnumSchema = z.enum(['id','requestId','venueName','startTime','endTime']);

export default VenueRequestScalarFieldEnumSchema;
