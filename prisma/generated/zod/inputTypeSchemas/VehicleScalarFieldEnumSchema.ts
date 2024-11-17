import { z } from 'zod';

export const VehicleScalarFieldEnumSchema = z.enum(['id','name','type','imageUrl','capacity','licensePlate','odometer','isArchived','createdAt','updatedAt','status','departmentId']);

export default VehicleScalarFieldEnumSchema;
