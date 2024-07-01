'use client';

import Link from 'next/link';
import SignInForm from '../../../components/forms/signin-form';
import { motion, LayoutGroup } from 'framer-motion';

export default function SignInPage() {
  return (
    <LayoutGroup>
      <div className="mx-auto grid w-full place-items-center gap-3 sm:w-[350px] mb-16">
        <motion.div layout className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </motion.div>
        <SignInForm />
      </div>
    </LayoutGroup>
  );
}
