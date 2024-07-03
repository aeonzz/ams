'use client';

import Link from 'next/link';
import SignInForm from '../../../components/forms/signin-form';
import { LayoutGroup } from 'framer-motion';
import { MotionLayout } from '@/components/layouts/motion-layout';

export default function SignInPage() {
  return (
    <LayoutGroup>
      <div className="mx-auto mb-16 grid w-full place-items-center gap-3 sm:w-[350px]">
        <MotionLayout className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </MotionLayout>
        <SignInForm />
      </div>
    </LayoutGroup>
  );
}
