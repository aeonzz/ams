'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { emailSchema } from '@/lib/email/utils';

const ForgotPasswordForm = ({
  setIsEmailSent,
}: {
  setIsEmailSent: (state: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: z.infer<typeof emailSchema>) {
    setIsLoading(true);

    try {
      const payload = {
        email: data.email,
      };
      console.log(payload);
      const req = await fetch('/api/email', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const res = await req.json();
      if (res.data.id) setIsEmailSent(true);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast.error('Uh oh! Something went wrong.', {
        description:
          'An error occurred while making the request. Please try again later',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="!mt-7 w-[450px]">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-3">
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <Button type="submit" variant="secondary" disabled={isLoading}>
                  <Send className="mr-2 h-4 w-4" />
                  Reset Password
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
