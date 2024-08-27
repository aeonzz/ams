import { z } from 'zod';

export const VehicleScalarFieldEnumSchema = z.enum(['id','name','type','imageUrl','capacity','licensePlate','createdAt','updatedAt','status']);

export default VehicleScalarFieldEnumSchema;
