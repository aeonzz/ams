import { z } from 'zod';

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  expiresAt: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

export default SessionSchema;
