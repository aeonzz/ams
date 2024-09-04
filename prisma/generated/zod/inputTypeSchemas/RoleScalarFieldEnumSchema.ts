import { z } from 'zod';

export const RoleScalarFieldEnumSchema = z.enum(['id','name','description','createdAt','updatedAt']);

export default RoleScalarFieldEnumSchema;
