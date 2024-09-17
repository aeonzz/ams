import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','email','profileUrl','hashedPassword','resetPasswordToken','resetPasswordTokenExpiry','firstName','middleName','lastName','isArchived','departmentId','createdAt','updatedAt']);

export default UserScalarFieldEnumSchema;
