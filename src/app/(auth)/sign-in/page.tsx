"use client";

import { LayoutGroup } from "framer-motion";

import { MotionLayout } from "@/components/layouts/motion-layout";

import SignInForm from "../../../components/forms/signin-form";

export default function SignInPage() {
  return (
    <LayoutGroup>
      <div className="mx-auto mb-16 grid w-full max-w-[340px] place-items-center gap-3 bg-background p-6 rounded-md">
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
