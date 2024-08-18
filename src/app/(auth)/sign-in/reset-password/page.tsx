'use client'

import React from "react";

import { db } from "@/lib/db/index";

import ForgotPassword from "../../_components/forgot-password";
import ResetPasswordForm from "@/components/forms/reset-password-form";
import { MotionLayout } from "@/components/layouts/motion-layout";

interface ResetPasswordPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const token = searchParams.token as string;

  if (!token) {
    return <ForgotPassword />;
  }

  const user = await db.user.findUnique({
    where: { resetPasswordToken: token },
  });

  if (!user || !user.resetPasswordTokenExpiry) {
    return <ErrorMessage message="Invalid token" />;
  }

  const isTokenExpired = new Date() > user.resetPasswordTokenExpiry;

  if (isTokenExpired) {
    return <ErrorMessage message="Token expired" />;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <MotionLayout className="flex flex-col items-center justify-center space-y-2">
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Reset Your Password
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          Please enter your new password and confirm it to complete the reset
          process.
        </p>
      </MotionLayout>
      <ResetPasswordForm resetPasswordToken={token} className="sm:w-[330px]" />
    </div>
  );
}

const ErrorMessage = ({ message }: { message: string }) => (
  <h1 className="scroll-m-20 text-center text-2xl font-semibold tracking-tight">
    {message}
  </h1>
);
