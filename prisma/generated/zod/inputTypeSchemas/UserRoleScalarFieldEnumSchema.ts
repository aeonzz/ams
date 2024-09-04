import { z } from 'zod';

export const UserRoleScalarFieldEnumSchema = z.enum(['id','userId','roleId','departmentId','createdAt','updatedAt']);

export default UserRoleScalarFieldEnumSchema;
