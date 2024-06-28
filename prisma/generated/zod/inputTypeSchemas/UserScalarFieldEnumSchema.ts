import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','email','hashedPassword','resetPasswordToken','resetPasswordTokenExpiry','name']);

export default UserScalarFieldEnumSchema;
