import { z } from 'zod';

export const RoleScalarFieldEnumSchema = z.enum(['id','name','description','createdAt','updatedAt','isArchived']);

export default RoleScalarFieldEnumSchema;
