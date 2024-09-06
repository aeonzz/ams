import { z } from 'zod';

export const SectionScalarFieldEnumSchema = z.enum(['id','name','description','createdAt','updatedAt','isArchived']);

export default SectionScalarFieldEnumSchema;
