import { z } from 'zod';

export const VenueSetupRequirementScalarFieldEnumSchema = z.enum(['id','venueId','available','name','createdAt','updatedAt']);

export default VenueSetupRequirementScalarFieldEnumSchema;
