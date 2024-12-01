import { z } from 'zod';

export const VehicleStatusSchema = z.enum(['AVAILABLE','IN_USE','UNDER_MAINTENANCE']);

export type VehicleStatusType = `${z.infer<typeof VehicleStatusSchema>}`

export default VehicleStatusSchema;
