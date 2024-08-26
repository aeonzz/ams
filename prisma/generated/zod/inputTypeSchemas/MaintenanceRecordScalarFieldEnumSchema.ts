import { z } from 'zod';

export const MaintenanceRecordScalarFieldEnumSchema = z.enum(['id','date','details','vehicleId']);

export default MaintenanceRecordScalarFieldEnumSchema;
