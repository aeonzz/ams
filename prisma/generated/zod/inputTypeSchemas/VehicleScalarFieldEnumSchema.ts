import { z } from 'zod';

export const VehicleScalarFieldEnumSchema = z.enum(['id','name','type','image','capacity','licensePlate','createdAt','updatedAt','status']);

export default VehicleScalarFieldEnumSchema;
