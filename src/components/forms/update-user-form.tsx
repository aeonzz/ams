"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateUser } from "@/lib/actions/users";
import { ClientUpdateUserSchema, User } from "@/lib/db/schema/user";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Separator } from "../ui/separator";

interface UpdateUserFormProps {
  email: string;
  username: string;
}

export default function UpdateUserForm({ email, username }: UpdateUserFormProps) {
  const form = useForm<User>({
    resolver: zodResolver(ClientUpdateUserSchema),
    defaultValues: {
      email: email,
      username: username,
    },
  });

  const { isPending, mutate } = useServerActionMutation(updateUser, {
    onSuccess: () => {
      toast.success("Saved!", {
        description: "User profile has been updated.",
      });
    },
    onError: (err) => {
      console.log(err);
      toast.error("Uh oh! Something went wrong.", {
        description: "Something went wrong, please try again later.",
      });
    },
  });

  function onSubmit(data: User) {
    if (data.email !== email || data.username !== username) {
      mutate({ ...data, path: "/settings/account" });
    }
  }

  function handleBlur() {
    form.handleSubmit(onSubmit)();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0">
              <FormLabel>Email</FormLabel>
              <div className="flex items-center space-x-3">
                <FormMessage />
                <FormControl className="w-60">
                  <Input
                    placeholder="m@example.com"
                    autoComplete="off"
                    disabled={isPending}
                    {...field}
                    onBlur={handleBlur}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <Separator className="my-4" />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0">
              <FormLabel>Username</FormLabel>
              <div className="flex items-center space-x-3">
                <FormMessage />
                <FormControl className="w-60">
                  <Input
                    placeholder="username"
                    autoComplete="off"
                    disabled={isPending}
                    {...field}
                    onBlur={handleBlur}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
