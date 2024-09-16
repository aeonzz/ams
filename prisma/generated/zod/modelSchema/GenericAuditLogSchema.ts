import { z } from 'zod';
import { JsonValueSchema } from '../inputTypeSchemas/JsonValueSchema'
import { EntityTypeSchema } from '../inputTypeSchemas/EntityTypeSchema'
import { ChangeTypeSchema } from '../inputTypeSchemas/ChangeTypeSchema'
import type { JsonValueType } from '../inputTypeSchemas/JsonValueSchema';
import type { UserWithRelations } from './UserSchema'
import { UserWithRelationsSchema } from './UserSchema'

/////////////////////////////////////////
// GENERIC AUDIT LOG SCHEMA
/////////////////////////////////////////

export const GenericAuditLogSchema = z.object({
  entityType: EntityTypeSchema,
  changeType: ChangeTypeSchema,
  id: z.string(),
  entityId: z.string(),
  oldValue: JsonValueSchema.nullable(),
  newValue: JsonValueSchema.nullable(),
  changedById: z.string(),
  timestamp: z.coerce.date(),
})

export type GenericAuditLog = z.infer<typeof GenericAuditLogSchema>

/////////////////////////////////////////
// GENERIC AUDIT LOG RELATION SCHEMA
/////////////////////////////////////////

export type GenericAuditLogRelations = {
  changedBy: UserWithRelations;
};

export type GenericAuditLogWithRelations = Omit<z.infer<typeof GenericAuditLogSchema>, "oldValue" | "newValue"> & {
  oldValue?: JsonValueType | null;
  newValue?: JsonValueType | null;
} & GenericAuditLogRelations

export const GenericAuditLogWithRelationsSchema: z.ZodType<GenericAuditLogWithRelations> = GenericAuditLogSchema.merge(z.object({
  changedBy: z.lazy(() => UserWithRelationsSchema),
}))

export default GenericAuditLogSchema;
