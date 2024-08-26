import { z } from 'zod';

export const VehicleStatusSchema = z.enum(['AVAILABLE','IN_USE','UNDER_MAINTENANCE','RESERVED']);

export type VehicleStatusType = `${z.infer<typeof VehicleStatusSchema>}`

export default VehicleStatusSchema;
