import { z } from 'zod';

export const VenueScalarFieldEnumSchema = z.enum(['id','name','location','capacity','imageUrl','createdAt','updatedAt','status']);

export default VenueScalarFieldEnumSchema;
