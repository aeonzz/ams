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
import { PriorityTypeSchema } from "prisma/generated/zod";
import { usePathname } from "next/navigation";
import { ReqType } from "./create-request";
import { SubmitButton } from "@/components/ui/submit-button";
import { useCreateRequest } from "@/lib/hooks/use-create-request";
import JobTypeOption from "./job-type-option";
import { Category, Item, Job, jobs } from "@/config/job-list";

interface JobRequestInputProps {
  setType: React.Dispatch<React.SetStateAction<ReqType | null>>;
  type: ReqType;
}

export type Selection = {
  jobType: Job;
  category: Category;
  item: string;
};

export default function JobRequestInput({
  setType,
  type,
}: JobRequestInputProps) {
  const pathname = usePathname();

  const [selection, setSelection] = useState<Selection>({
    jobType: jobs[0],
    category: jobs[0].categories[0],
    item: jobs[0].categories[0].items[0].value,
  });

  const { value } = type;
  const department = "IT";
  const { isPending, mutate } = useCreateRequest();

  const form = useForm<Request>({
    resolver: zodResolver(RequestSchema),
  });

  function onSubmit(values: Request) {
    const data = {
      ...values,
      priority: PriorityTypeSchema.Enum.LOW,
      type: value,
      department: department,
      jobType: selection.jobType.value,
      name: selection.item,
      path: pathname,
      itemCategory: selection.category.value,
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
          <div className="space-y-2 px-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={1}
                      maxRows={12}
                      placeholder="Description..."
                      className="min-h-20 bg-tertiary focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <MotionLayout className="flex space-x-3">
              <JobTypeOption
                selection={selection}
                setSelection={setSelection}
              />
            </MotionLayout>
          </div>
          <MotionLayout>
            <Separator className="my-4" />
            <DialogFooter>
              <div></div>
              <SubmitButton disabled={isPending} className="w-28">
                Submit
              </SubmitButton>
            </DialogFooter>
          </MotionLayout>
        </form>
      </Form>
    </>
  );
}
