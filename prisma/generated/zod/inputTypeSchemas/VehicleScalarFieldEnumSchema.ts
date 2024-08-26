import { z } from 'zod';

export const VehicleScalarFieldEnumSchema = z.enum(['id','name','type','image','capacity','licensePlate','status']);

export default VehicleScalarFieldEnumSchema;
