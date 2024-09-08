import { z } from 'zod';

export const JobRequestAuditLogScalarFieldEnumSchema = z.enum(['id','jobRequestId','changeType','oldValue','newValue','changedById','timestamp']);

export default JobRequestAuditLogScalarFieldEnumSchema;
