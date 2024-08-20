import { z } from 'zod';

export const DepartmentScalarFieldEnumSchema = z.enum(['id','label','name','createdAt','updatedAt']);

export default DepartmentScalarFieldEnumSchema;
