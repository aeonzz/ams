"use client";

import React from "react";
import DateTimePicker from "@/components/ui/date-time-picker";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { assignJobTime } from "@/lib/actions/requests";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const schema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
});

interface AssignJobTimeProps {
  requestId: string;
  date: Date | null;
  setIsOpen: (state: boolean) => void;
}

export default function AssignJobTime({
  requestId,
  date,
  setIsOpen,
}: AssignJobTimeProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, isSuccess } =
    useServerActionMutation(assignJobTime);
  console.log(isSuccess);
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      date: date ?? undefined,
    },
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const data = {
        date: values.date,
        path: pathname,
        requestId: requestId,
      };
      toast.promise(mutateAsync(data), {
        loading: "Saving...",
        success: () => {
          setIsOpen(false);
          queryClient.invalidateQueries({
            queryKey: [requestId],
          });
          return "Saved";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      });
    } catch (error) {
      console.error("Error during update:", error);
      toast.error("An error occurred during update. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-5 flex items-end gap-3"
      >
        <DateTimePicker
          form={form}
          size="sm"
          label="Date and Time of work"
          name="date"
          isLoading={isPending}
          disabled={isPending}
          className="w-full"
        />
        <Button variant="secondary" size="sm" disabled={isPending}>
          Confirm
        </Button>
      </form>
    </Form>
  );
}
