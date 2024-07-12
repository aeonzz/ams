import { z } from 'zod';

/////////////////////////////////////////
// SETTING SCHEMA
/////////////////////////////////////////

export const SettingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fontSize: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Setting = z.infer<typeof SettingSchema>

export default SettingSchema;
