'use client';

import Link from 'next/link';
import SignInForm from '../../../components/forms/SignInForm';
import { motion, LayoutGroup } from 'framer-motion';

export default function SignInPage() {
  return (
    <LayoutGroup>
      <div className="w-full">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-full place-items-center gap-6">
            <motion.div layout className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </motion.div>
            <SignInForm />
            <motion.div layout className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="#" className="text-blue-500 underline">
                Sign up
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </LayoutGroup>
  );
}
