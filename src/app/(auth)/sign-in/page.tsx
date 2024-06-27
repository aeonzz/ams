'use client';

import Link from 'next/link';
import SignInForm from '../_components/SignInForm';
import { m, LazyMotion, domAnimation, LayoutGroup } from 'framer-motion';

export default function SignInPage() {
  return (
    <LazyMotion features={domAnimation}>
      <LayoutGroup>
        <div className="h-screen w-full lg:grid lg:grid-cols-2">
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-full place-items-center gap-6">
              <m.div layout className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email below to login to your account
                </p>
              </m.div>
              <SignInForm />
              <m.div layout className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="#" className="underline">
                  Sign up
                </Link>
              </m.div>
            </div>
          </div>
          <div className="hidden bg-muted lg:block">
            {/* <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
          </div>
        </div>
      </LayoutGroup>
    </LazyMotion>
  );
}
