import { z } from 'zod';

export const VenueStatusSchema = z.enum(['AVAILABLE','IN_USE','UNDER_MAINTENANCE','CLOSED']);

export type VenueStatusType = `${z.infer<typeof VenueStatusSchema>}`

export default VenueStatusSchema;
