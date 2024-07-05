"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateUser } from "@/lib/actions/users";
import { updateUserSchema } from "@/lib/db/schema/auth";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function Page() {
  const { isPending, mutate } = useServerActionMutation(updateUser);
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data: z.infer<typeof updateUserSchema>) => mutate(data))}
        className="w-2/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
