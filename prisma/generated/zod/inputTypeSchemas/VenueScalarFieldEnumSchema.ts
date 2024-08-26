import { z } from 'zod';

export const VenueScalarFieldEnumSchema = z.enum(['id','name','location','capacity','imageUrl','status']);

export default VenueScalarFieldEnumSchema;
