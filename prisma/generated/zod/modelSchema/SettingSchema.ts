import { z } from 'zod';
import type { UserWithRelations } from './UserSchema'
import { UserWithRelationsSchema } from './UserSchema'

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

/////////////////////////////////////////
// SETTING RELATION SCHEMA
/////////////////////////////////////////

export type SettingRelations = {
  user: UserWithRelations;
};

export type SettingWithRelations = z.infer<typeof SettingSchema> & SettingRelations

export const SettingWithRelationsSchema: z.ZodType<SettingWithRelations> = SettingSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

export default SettingSchema;
