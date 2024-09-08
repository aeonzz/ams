import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','email','profileUrl','hashedPassword','resetPasswordToken','resetPasswordTokenExpiry','firstName','middleName','lastName','department','createdAt','sectionId','updatedAt']);

export default UserScalarFieldEnumSchema;
