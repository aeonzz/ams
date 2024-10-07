import { z } from 'zod';

export const VenueScalarFieldEnumSchema = z.enum(['id','name','location','capacity','imageUrl','venueType','rulesAndRegulations','features','isArchived','createdAt','updatedAt','status','departmentId']);

export default VenueScalarFieldEnumSchema;
