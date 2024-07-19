"use client";

import React, { useState } from "react";

import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { ChevronLeft } from "lucide-react";
import { Textarea } from "../../ui/text-area";
import RequestTypeOption from "./request-type-option";
import { Separator } from "../../ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Request, RequestSchema } from "@/lib/db/schema/request";
import { MotionLayout } from "@/components/layouts/motion-layout";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { toast } from "sonner";
import { createRequest } from "@/lib/actions/request";
import { PriorityTypeSchema } from "prisma/generated/zod";
import JobTypeOption, { Jobs, Job } from "./job-type-option";
import { usePathname } from "next/navigation";
import { useDialog } from "@/lib/hooks/use-dialog";
import { ReqType } from "./create-request";
import ItemOption from "./item-option";

interface JobRequestInputProps {
  setType: (type: ReqType | null) => void;
  type: ReqType;
}

export default function JobRequestInput({
  setType,
  type,
}: JobRequestInputProps) {
  const dialog = useDialog();
  const pathname = usePathname();
  const [jobType, setJobType] = useState<Job | undefined>(
    Jobs.find((job) => job.value === "repair")
  );
  const { value } = type;
  const deparment = "IT";
  const { isPending, mutate } = useServerActionMutation(createRequest, {
    onSuccess: () => {
      dialog.setActiveDialog("");
      toast.success("Request Successful!", {
        description:
          "Your request has been submitted and is awaiting approval.",
      });
    },
    onError: (err) => {
      console.log(err);
      toast.error("Uh oh! Something went wrong.", {
        description: "Something went wrong, please try again later.",
      });
    },
  });

  const form = useForm<Request>({
    resolver: zodResolver(RequestSchema),
  });

  function onSubmit(values: Request) {
    const data = {
      ...values,
      priority: PriorityTypeSchema.Enum.LOW,
      type: value,
      department: deparment,
      jobType: jobType?.value,
      path: pathname,
    };
    mutate(data);
  }

  return (
    <>
      <DialogHeader className="px-2">
        <div className="flex items-center space-x-1">
          <Button
            size="icon"
            className="size-7"
            variant="ghost2"
            onClick={() => {
              setType(null);
            }}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <DialogTitle>Job Request</DialogTitle>
        </div>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="px-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={1}
                      maxRows={8}
                      placeholder="Add description..."
                      className="min-h-24 border-none px-[2px] py-0 focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <MotionLayout className="flex space-x-2">
              <JobTypeOption jobType={jobType} setJobType={setJobType} />
              <ItemOption />
            </MotionLayout>
          </div>
          <MotionLayout>
            <Separator className="my-4" />
            <DialogFooter>
              <div></div>
              <Button type="submit" disabled={isPending}>
                Submit
              </Button>
            </DialogFooter>
          </MotionLayout>
        </form>
      </Form>
    </>
  );
}
