import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','email','profileUrl','hashedPassword','resetPasswordToken','resetPasswordTokenExpiry','firstName','middleName','lastName','isArchived','departmentId','createdAt','sectionId','updatedAt']);

export default UserScalarFieldEnumSchema;
