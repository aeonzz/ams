import { db } from '@/lib/db/index';
import React from "react";
import ForgotPassword from "./_components/ForgotPassword";
import ChangePasswordForm from '@/components/forms/ChangePasswordForm';

interface ResetPasswordPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = async ({
  searchParams,
}) => {

  if (searchParams.token) {
    const user = await db.user.findUnique({
      where: {
        resetPasswordToken: searchParams.token as string,
      },
    });

    if (!user)
      return (
        <h1 className="tracking-tightl scroll-m-20 text-center text-2xl font-semibold">
          Invalid token
        </h1>
      );
    const resetPasswordTokenExpiry = user.resetPasswordTokenExpiry;
    if (!resetPasswordTokenExpiry)
      return (
        <h1 className="tracking-tightl scroll-m-20 text-center text-2xl font-semibold">
          Invalid token
        </h1>
      );
    const today = new Date();
    const isTokenExpired = today > resetPasswordTokenExpiry;
    if (isTokenExpired)
      return (
        <h1 className="tracking-tightl scroll-m-20 text-center text-2xl font-semibold">
          Token expired
        </h1>
      );

    return (
      <>
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Reset Your Password
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          Please enter your new password and confirm it to complete the reset
          process.
        </p>
        <ChangePasswordForm resetPasswordToken={searchParams.token as string} />
      </>
    );
  } else {
    return (
      <ForgotPassword />
    );
  }
};

export default ResetPasswordPage;