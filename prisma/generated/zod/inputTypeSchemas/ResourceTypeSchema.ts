import { z } from 'zod';

export const ResourceTypeSchema = z.enum(['JOB','REQUEST','FILE','TASK','REWORK','SUPPLY']);

export type ResourceTypeType = `${z.infer<typeof ResourceTypeSchema>}`

export default ResourceTypeSchema;
