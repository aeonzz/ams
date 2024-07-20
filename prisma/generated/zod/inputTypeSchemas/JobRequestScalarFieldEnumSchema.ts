import { z } from 'zod';

export const JobRequestScalarFieldEnumSchema = z.enum(['id','requestId','jobType','description','repItemId']);

export default JobRequestScalarFieldEnumSchema;
