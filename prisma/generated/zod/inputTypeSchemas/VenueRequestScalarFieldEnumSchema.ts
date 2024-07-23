import { z } from 'zod';

export const VenueRequestScalarFieldEnumSchema = z.enum(['id','venueName','startTime','endTime','requestId']);

export default VenueRequestScalarFieldEnumSchema;
