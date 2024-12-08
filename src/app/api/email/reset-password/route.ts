import crypto from "crypto";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import nodemailer from "nodemailer";
import { emailSchema } from "@/lib/email/utils";
import { ResetPasswordTemplate } from "@/components/email/reset-password-template";
import { render } from "@react-email/components";
import { env } from "@/lib/env.mjs";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = emailSchema.parse(body);

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT || "587"),
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

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

    const emailHtml = render(
      ResetPasswordTemplate({
        email: email,
        resetPasswordToken: resetPasswordToken,
      })
    );

    const data = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Reset Your Password",
      html: emailHtml,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error:
        "An error occurred while making the request. Please try again later",
    });
  }
}
