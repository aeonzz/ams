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
import { SubmitButton } from '../SubmitButton';
import { motion, AnimatePresence } from 'framer-motion';

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
        className="grid w-[350px] gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <motion.div layout className="space-y-2">
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
              </motion.div>
              <AnimatePresence mode="popLayout">
                {form.formState.errors.email && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, type: 'spring' }}
                  >
                    <FormMessage />
                  </motion.div>
                )}
              </AnimatePresence>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <motion.div layout className="space-y-2">
                <div className="flex justify-between">
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
              </motion.div>
              <AnimatePresence mode="popLayout">
                {form.formState.errors.password && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, type: 'spring' }}
                  >
                    <FormMessage />
                  </motion.div>
                )}
              </AnimatePresence>
            </FormItem>
          )}
        />
        <motion.div layout>
          <SubmitButton
            disabled={isLoading}
            className="w-full"
            variant="ringHover"
          >
            Sign in
          </SubmitButton>
        </motion.div>
      </form>
    </Form>
  );
}
