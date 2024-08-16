import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','email','profileUrl','hashedPassword','resetPasswordToken','resetPasswordTokenExpiry','username','department','createdAt','updatedAt','role']);

export default UserScalarFieldEnumSchema;
