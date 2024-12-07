"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { emailSchema } from "@/lib/email/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { MotionLayout } from "@/components/layouts/motion-layout";

export default function ForgotPassword() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof emailSchema>) {
    setIsLoading(true);

    const payload = {
      email: data.email,
    };

    axios
      .post("/api/email/reset-password", payload)
      .then((res) => {
        if (res.data.error) {
          console.log(res.data.error);
          toast.error("Uh oh! Something went wrong.", {
            description: res.data.error,
          });
        } else {
          setIsEmailSent(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        toast.error("Uh oh! Something went wrong.", {
          description:
            "An error occurred while making the request. Please try again later",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  return (
    <div className="grid place-items-center rounded-md bg-background p-6">
      {isEmailSent ? (
        <>
          <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Reset Email Sent
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Reset email sent! Please check your inbox for further instructions.
          </p>
        </>
      ) : (
        <>
          <MotionLayout className="flex flex-col items-center justify-center gap-2 text-center">
            <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-center text-sm text-muted-foreground">
              No worries, we can help! Enter the email address associated with
              your account and click the &quot;Reset Password&quot; button
              below.
              <br /> We&apos;ll send you a link to reset your password.
            </p>
          </MotionLayout>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 w-full max-w-[340px]"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <MotionLayout>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                    </MotionLayout>
                    <FormMessage />
                    <SubmitButton
                      disabled={isLoading}
                      variant="ringHover"
                      className="w-full"
                      type="submit"
                    >
                      Reset Password
                    </SubmitButton>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
