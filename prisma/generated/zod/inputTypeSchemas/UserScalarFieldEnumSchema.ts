import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','email','profileUrl','hashedPassword','resetPasswordToken','resetPasswordTokenExpiry','name','role']);

export default UserScalarFieldEnumSchema;
