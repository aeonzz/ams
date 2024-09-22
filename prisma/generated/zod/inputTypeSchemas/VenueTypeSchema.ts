import { z } from 'zod';

export const VenueTypeSchema = z.enum(['CLASSROOM','AUDITORIUM','SPORTS_HALL','LAB','CONFERENCE_ROOM','LIBRARY','OTHER']);

export type VenueTypeType = `${z.infer<typeof VenueTypeSchema>}`

export default VenueTypeSchema;
