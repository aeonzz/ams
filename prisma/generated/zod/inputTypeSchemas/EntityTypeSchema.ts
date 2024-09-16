import { z } from 'zod';

export const EntityTypeSchema = z.enum(['JOB_REQUEST','VENUE_REQUEST','RETURNABLE_REQUEST','SUPPLY_REQUEST','TRANSPORT_REQUEST','OTHER']);

export type EntityTypeType = `${z.infer<typeof EntityTypeSchema>}`

export default EntityTypeSchema;
