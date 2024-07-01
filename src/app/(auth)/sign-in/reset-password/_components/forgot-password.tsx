'use client';

import { SubmitButton } from '@/components/ui/submit-button';
import { emailSchema } from '@/lib/email/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function ForgotPassword() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: z.infer<typeof emailSchema>) {
    setIsLoading(true);

    const payload = {
      email: data.email,
    };

    axios
      .post('/api/email', payload)
      .then((res) => {
        if (res.data.error) {
          toast.error('Uh oh! Something went wrong.', {
            description: res.data.error,
          });
        } else {
          setIsEmailSent(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        toast.error('Uh oh! Something went wrong.', {
          description:
            'An error occurred while making the request. Please try again later',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  return (
    <>
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
          <motion.div
            layout
            className="flex flex-col items-center justify-center gap-2"
          >
            <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-center text-sm text-muted-foreground">
              No worries, we can help! Enter the email address associated with
              your account and click the &quot;Reset Password&quot; button
              below.
              <br /> We&apos;ll send you a link to reset your password.
            </p>
          </motion.div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 w-[354px]"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <motion.div layout className="space-y-2">
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <SubmitButton
                        disabled={isLoading}
                        variant="ringHover"
                        className="w-full"
                        type="submit"
                      >
                        Reset Password
                      </SubmitButton>
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
            </form>
          </Form>
        </>
      )}
    </>
  );
}
