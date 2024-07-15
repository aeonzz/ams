"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { resetPassword } from "@/lib/actions/users";
import { ResetPasswordSchema } from "@/lib/db/schema/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { MotionLayout } from "../layouts/motion-layout";
import { SubmitButton } from "../ui/submit-button";

interface ChangePasswordFormProps {
  resetPasswordToken: string;
}

export default function ChangePasswordForm({ resetPasswordToken }: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    setIsLoading(true);

    const [data, error] = await resetPassword({
      password: values.password,
      resetPasswordToken: resetPasswordToken,
    });

    if (error) {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description: error.message,
      });
    } else {
      router.push("/sign-in");
      router.refresh();
      toast.success("Success", {
        description: "Password reset successful",
      });
    }
  }

  return (
    <>
      <MotionLayout className="flex flex-col items-center justify-center space-y-2">
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">Reset Your Password</h1>
        <p className="text-center text-sm text-muted-foreground">
          Please enter your new password and confirm it to complete the reset process.
        </p>
      </MotionLayout>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3 sm:w-[330px]">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <MotionLayout>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      disabled={isLoading}
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                </MotionLayout>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <MotionLayout>
                  <FormLabel>Re-Enter your password</FormLabel>
                  <FormControl>
                    <Input placeholder="Re-Enter your new password" type="password" disabled={isLoading} {...field} />
                  </FormControl>
                </MotionLayout>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton disabled={isLoading} className="w-full" variant="ringHover">
            Confirm
          </SubmitButton>
        </form>
      </Form>
    </>
  );
}
