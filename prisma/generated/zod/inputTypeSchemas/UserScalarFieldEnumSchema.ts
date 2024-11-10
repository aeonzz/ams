import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','email','profileUrl','hashedPassword','resetPasswordToken','resetPasswordTokenExpiry','firstName','middleName','lastName','isArchived','createdAt','updatedAt','isAdmin']);

export default UserScalarFieldEnumSchema;
