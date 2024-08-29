import { z } from 'zod';

export const ItemReservationScalarFieldEnumSchema = z.enum(['id','itemId','startDate','endDate','requestId']);

export default ItemReservationScalarFieldEnumSchema;
