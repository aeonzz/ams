"use client";

import { createVenueRequest } from "@/lib/actions/requests";
import {
  type ExtendedVenueRequestSchema,
  VenueRequestSchema,
} from "@/lib/schema/request";
import {
  UseMutateAsyncFunction,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/ui/submit-button";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/hooks/use-session";
import { type RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import axios from "axios";
import { type ReservedDatesAndTimes } from "@/lib/schema/utils";
import DateTimePicker from "@/components/ui/date-time-picker";
import { createReturnableResourceRequest } from "@/lib/actions/resource";
import type {
  ExtendedReturnableResourceRequestSchema,
  ReturnableResourceRequestSchema,
} from "@/lib/schema/resource/returnable-resource";
import ItemsField from "./items-field";
import { Textarea } from "@/components/ui/text-area";
import { Input } from "@/components/ui/input";

interface ReturnableResourceRequestInputProps {
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createReturnableResourceRequest>[0],
    unknown
  >;
  isPending: boolean;
  form: UseFormReturn<ReturnableResourceRequestSchema>;
  type: RequestTypeType;
  handleOpenChange: (open: boolean) => void;
  isFieldsDirty: boolean;
}

export default function ReturnableResourceRequestInput({
  form,
  mutateAsync,
  isPending,
  type,
  handleOpenChange,
  isFieldsDirty,
}: ReturnableResourceRequestInputProps) {
  const pathname = usePathname();
  const currentUser = useSession();
  const { department } = currentUser;
  const queryClient = useQueryClient();
  const items = form.watch("items");

  async function onSubmit(values: ReturnableResourceRequestSchema) {
    const data: ExtendedReturnableResourceRequestSchema = {
      ...values,
      priority: "LOW",
      type: type,
      department: department,
      path: pathname,
    };

    toast.promise(mutateAsync(data), {
      loading: "Submitting...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["pending-req-overview"] });
        queryClient.invalidateQueries({ queryKey: ["pending-req"] });
        queryClient.invalidateQueries({ queryKey: ["total-req-overview"] });
        handleOpenChange(false);
        return "Your request has been submitted and is awaiting approval.";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Returnable Resource Request</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="scroll-bar flex max-h-[60vh] gap-6 overflow-y-auto px-4 py-1">
            <div className="flex w-[307px] flex-col space-y-2">
              <ItemsField form={form} name="items" isPending={isPending} />
              <DateTimePicker
                form={form}
                name="dateNeeded"
                label="Date Needed"
                disabled={isPending}
              />
              <DateTimePicker
                form={form}
                name="returnDate"
                label="Return Date"
                disabled={isPending}
              />
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator className="my-4" />
          <DialogFooter>
            {isFieldsDirty ? (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  form.reset();
                }}
                variant="destructive"
                disabled={isPending}
              >
                Reset form
              </Button>
            ) : (
              <div></div>
            )}
            <SubmitButton disabled={isPending} type="submit" className="w-28">
              Submit
            </SubmitButton>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
