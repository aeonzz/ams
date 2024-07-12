import { z } from 'zod';

export const SettingScalarFieldEnumSchema = z.enum(['id','userId','fontSize','createdAt','updatedAt']);

export default SettingScalarFieldEnumSchema;
