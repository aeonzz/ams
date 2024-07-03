'use client';

import Link from 'next/link';
import { signInAction } from '@/lib/actions/users';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authenticationSchema } from '@/lib/db/schema/auth';
import { toast } from 'sonner';
import { PasswordInput } from '../ui/password-input';
import { SubmitButton } from '../ui/submit-button';
import { MotionLayout } from '../layouts/motion-layout';

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof authenticationSchema>>({
    resolver: zodResolver(authenticationSchema),
  });

  async function onSubmit(values: z.infer<typeof authenticationSchema>) {
    setIsLoading(true);
    const [data, error] = await signInAction(values);

    if (error) {
      setIsLoading(false);
      toast.error('Uh oh! Something went wrong.', {
        description: error.message,
      });
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <MotionLayout>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="m@example.com"
                    type="email"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <MotionLayout>
                <div className="flex items-center justify-between mb-1">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/sign-in/reset-password"
                    className="ml-auto inline-block text-sm text-blue-500 underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    id="password"
                    autoComplete="off"
                    placeholder="••••••••••••"
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
          Sign in
        </SubmitButton>
      </form>
    </Form>
  );
}
