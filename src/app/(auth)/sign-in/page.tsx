"use client";

import { LayoutGroup } from "framer-motion";

import { MotionLayout } from "@/components/layouts/motion-layout";

import SignInForm from "../../../components/forms/signin-form";
import Image from "next/image";

export default function SignInPage() {
  return (
    <LayoutGroup>
      <div className="mx-auto mb-16 grid w-full max-w-[340px] place-items-center gap-3 rounded-md p-6">
        <MotionLayout className="grid place-items-center gap-2 text-center">
          <Image
            src={"/USTP-BLUE.png"}
            alt="ustp-image"
            width={100}
            height={100}
          />
          <p className="text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </MotionLayout>
        <SignInForm />
      </div>
    </LayoutGroup>
  );
}
