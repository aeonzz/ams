'use client';

import Link from 'next/link';
import { signInAction } from '@/lib/actions/users';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
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
import { PasswordInput } from './password-input';
import SubmitButton from './SubmitButton';

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof authenticationSchema>>({
    resolver: zodResolver(authenticationSchema),
  });

  async function onSubmit(values: z.infer<typeof authenticationSchema>) {
    setIsLoading(true);
    const response = await signInAction(values);

    if (response && response[0]?.error) {
      setIsLoading(false);
      toast.error('Uh oh! Something went wrong.', {
        description: response[0]?.error,
      });
    }

    if (response && response[1]?.message) {
      setIsLoading(false);
      toast.error('Uh oh! Something went wrong.', {
        description: response[1]?.message,
      });
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-[350px] gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="m@example.com"
                  type="email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  id="password"
                  autoComplete="password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton isLoading={isLoading} />
      </form>
    </Form>
  );
}