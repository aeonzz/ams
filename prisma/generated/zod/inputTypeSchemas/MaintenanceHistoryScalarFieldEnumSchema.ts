import { z } from 'zod';

export const MaintenanceHistoryScalarFieldEnumSchema = z.enum(['id','vehicleId','performedAt','odometer','description','createdAt']);

export default MaintenanceHistoryScalarFieldEnumSchema;
