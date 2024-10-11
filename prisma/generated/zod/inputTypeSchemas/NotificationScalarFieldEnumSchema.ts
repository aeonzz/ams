import { z } from 'zod';

export const NotificationScalarFieldEnumSchema = z.enum(['id','title','userId','message','isRead','resourceId','resourceType','notificationType','recepientId','createdAt','readAt','updatedAt']);

export default NotificationScalarFieldEnumSchema;
