import { z } from 'zod';

export const NotificationScalarFieldEnumSchema = z.enum(['id','title','message','isRead','resourceId','userId','departmentId','createdAt','readAt','updatedAt']);

export default NotificationScalarFieldEnumSchema;
