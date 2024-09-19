import { z } from 'zod';

export const UserDepartmentScalarFieldEnumSchema = z.enum(['id','userId','departmentId','createdAt','updatedAt']);

export default UserDepartmentScalarFieldEnumSchema;
