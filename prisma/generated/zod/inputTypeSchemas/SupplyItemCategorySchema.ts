import { z } from 'zod';

export const SupplyItemCategorySchema = z.enum(['OFFICE_SUPPLIES','ELECTRONICS','FURNITURE','CLEANING','MEDICAL','EDUCATIONAL','OTHER']);

export type SupplyItemCategoryType = `${z.infer<typeof SupplyItemCategorySchema>}`

export default SupplyItemCategorySchema;
