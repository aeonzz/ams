'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { resetPasswordSchema } from '@/lib/db/schema/auth';
import { resetPassword } from '@/lib/actions/users';
import { motion, AnimatePresence } from 'framer-motion';
import { SubmitButton } from '../SubmitButton';

interface ChangePasswordFormProps {
  resetPasswordToken: string;
}

export default function ChangePasswordForm({
  resetPasswordToken,
}: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    setIsLoading(true);

    const [data, error] = await resetPassword({
      password: values.password,
      resetPasswordToken: resetPasswordToken,
    });

    if (error) {
      setIsLoading(false);
      toast.error('Uh oh! Something went wrong.', {
        description: error.message,
      });
    } else {
      router.push('/sign-in');
      router.refresh();
      toast.success('Success', {
        description: 'Password reset successful',
      });
    }
  }

  return (
    <>
      <motion.div
        layout
        className="flex flex-col items-center justify-center space-y-2"
      >
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Reset Your Password
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          Please enter your new password and confirm it to complete the reset
          process.
        </p>
      </motion.div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[330px] space-y-3"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <motion.div layout className="space-y-2">
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <motion.div layout className="space-y-2">
                  <FormLabel>Re-Enter your password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Re-Enter your new password"
                      type="password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                </motion.div>
                <AnimatePresence mode="popLayout">
                  {form.formState.errors.confirmPassword && (
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
              Confirm
            </SubmitButton>
          </motion.div>
        </form>
      </Form>
    </>
  );
}
