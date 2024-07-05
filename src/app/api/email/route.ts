import crypto from "crypto";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { resend } from "@/lib/email/index";
import { emailSchema } from "@/lib/email/utils";
import { ResetPasswordTemplate } from "@/components/email/reset-password-template";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = emailSchema.parse(body);
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json({
        error: `User not found with email: ${email}`,
      });
    }

    const resetPasswordToken = crypto.randomBytes(32).toString("base64url");
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
      from: "HAHA <onboarding@resend.dev>",
      to: [email],
      subject: "Hello!",
      react: ResetPasswordTemplate({
        email: email,
        resetPasswordToken: resetPasswordToken,
      }),
      text: "Email powered by Resend.",
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: "An error occurred while making the request. Please try again later",
    });
  }
}
