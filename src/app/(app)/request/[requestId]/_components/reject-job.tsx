"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/text-area";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { reworkJobRequest } from "@/lib/actions/job";

const FormSchema = z.object({
  rejectionReason: z
    .string()
    .min(1, { message: "Rejection reason is required." })
    .max(500, {
      message: "Rejection reason must not be longer than 500 characters.",
    }),
});

interface RejectJobProps {
  requestId: string;
  disabled: boolean;
}

export default function RejectJob({ requestId, disabled }: RejectJobProps) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [isRejectAlertOpen, setIsRejectAlertOpen] = React.useState(false);
  const { isPending, mutateAsync } = useServerActionMutation(reworkJobRequest);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rejectionReason: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      toast.promise(
        mutateAsync({
          status: "VERIFIED",
          id: requestId,
          rejectionReason: data.rejectionReason,
        }),
        {
          loading: "Rejecting request...",
          success: () => {
            queryClient.invalidateQueries({
              queryKey: [requestId],
            });
            setIsRejectAlertOpen(false);
            return "Request rejected successfully.";
          },
          error: (err) => {
            console.log(err);
            return err.message;
          },
        }
      );
      form.reset();
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred during submission. Please try again.");
    }
  }

  return (
    <AlertDialog open={isRejectAlertOpen} onOpenChange={setIsRejectAlertOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full flex-1"
          disabled={disabled}
        >
          Reject
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Request</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide a reason for rejection and instructions for rework.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      maxRows={7}
                      placeholder="Rejection reason..."
                      className="resize-none placeholder:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => form.reset()}>
                Cancel
              </AlertDialogCancel>
              <Button
                type="submit"
                className="bg-destructive hover:bg-destructive/90"
                disabled={isPending}
              >
                {isPending ? "Rejecting..." : "Reject"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
