import { z } from 'zod';

export const DepartmentScalarFieldEnumSchema = z.enum(['id','label','name','acceptsJobs','createdAt','updatedAt','isArchived']);

export default DepartmentScalarFieldEnumSchema;
