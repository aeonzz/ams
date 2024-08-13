"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { changePassword, resetPassword } from "@/lib/actions/users";
import { ResetPasswordSchema } from "@/lib/db/schema/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { MotionLayout } from "../layouts/motion-layout";
import { SubmitButton } from "../ui/submit-button";
import { cn } from "@/lib/utils";
import { TZSAError } from "zsa";
import { PasswordInput } from "../ui/password-input";

interface ChangePasswordFormProps {
  resetPasswordToken?: string;
  className?: string;
}

export default function ResetPasswordForm({
  resetPasswordToken,
  className,
}: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const [error, setError] = useState<TZSAError<
    z.ZodObject<
      {
        password: z.ZodString;
        resetPasswordToken: z.ZodString;
      },
      "strip",
      z.ZodTypeAny,
      {
        password: string;
        resetPasswordToken: string;
      },
      {
        password: string;
        resetPasswordToken: string;
      }
    >
  > | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(ResetPasswordSchema),
  });

  async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    setIsLoading(true);

    if (resetPasswordToken) {
      const [data, error] = await resetPassword({
        password: values.password,
        resetPasswordToken: resetPasswordToken,
      });
      setError(error);
    } else {
      const [data, error] = await changePassword({
        password: values.password,
      });

      setError(error);
    }

    if (error) {
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description: error.message,
      });
    } else {
      form.reset();
      if (pathname.includes("reset-password")) {
        router.push("/sign-in");
      }
      router.refresh();
      toast.success("Success", {
        description: "Password reset successful",
      });
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(className, "w-full space-y-3")}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <MotionLayout>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="password"
                      placeholder="Enter your new password"
                      disabled={isLoading}
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
                    <PasswordInput
                      id="password"
                      placeholder="Re-Enter your new password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                </MotionLayout>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            disabled={isLoading}
            className="w-full"
            variant="ringHover"
          >
            Confirm
          </SubmitButton>
        </form>
      </Form>
    </>
  );
}
