import { z } from 'zod';

/////////////////////////////////////////
// VENUE REQUEST SCHEMA
/////////////////////////////////////////

export const VenueRequestSchema = z.object({
  id: z.number().int(),
  requestId: z.number().int(),
  venueName: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
})

export type VenueRequest = z.infer<typeof VenueRequestSchema>

export default VenueRequestSchema;
