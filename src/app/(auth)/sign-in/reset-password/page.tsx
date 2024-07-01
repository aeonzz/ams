import { db } from '@/lib/db/index';
import React from 'react';
import ChangePasswordForm from '@/components/forms/change-password-form';
import ForgotPassword from '../../../../components/screens/auth/forgot-password';

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
      <ChangePasswordForm resetPasswordToken={token} />
    </div>
  );
}

const ErrorMessage = ({ message }: { message: string }) => (
  <h1 className="scroll-m-20 text-center text-2xl font-semibold tracking-tight">
    {message}
  </h1>
);
