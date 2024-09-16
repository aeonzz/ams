import { z } from 'zod';

export const GenericAuditLogScalarFieldEnumSchema = z.enum(['id','entityId','entityType','changeType','oldValue','newValue','changedById','timestamp']);

export default GenericAuditLogScalarFieldEnumSchema;
