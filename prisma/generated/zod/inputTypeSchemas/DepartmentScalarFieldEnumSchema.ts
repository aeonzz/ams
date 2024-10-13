import { z } from 'zod';

export const DepartmentScalarFieldEnumSchema = z.enum(['id','description','name','acceptsJobs','managesTransport','managesBorrowRequest','managesSupplyRequest','managesFacility','createdAt','updatedAt','responsibilities','departmentType','isArchived']);

export default DepartmentScalarFieldEnumSchema;
