import { resend } from '@/lib/email/index';
import { emailSchema } from '@/lib/email/utils';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';
import { ResetPassword } from '@/components/email/reset-password';

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = emailSchema.parse(body);
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    const resetPasswordToken = crypto.randomBytes(32).toString('base64url');
    const today = new Date();
    const expiryDate = new Date(today.setDate(today.getDate() + 1));

    await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        resetPasswordToken,
        resetPasswordTokenExpiry: expiryDate,
      },
    });
    const data = await resend.emails.send({
      from: 'Fuck <ams-swart.vercel.app>',
      to: [email],
      subject: 'Hello world!',
      react: ResetPassword({
        email: email,
        resetPasswordToken: resetPasswordToken,
      }),
      text: 'Email powered by Resend.',
    });
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
