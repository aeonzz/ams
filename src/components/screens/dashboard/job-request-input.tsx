"use client";

import React, { useEffect, useState } from "react";

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
import JobTypeOption from "./job-type-option";
import { Category, Item, Job, jobs } from "@/config/job-list";
import PriorityOption, { priorities, Priority } from "./priority-option";
import UploadAttachment from "./upload-attachment";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { FileUploader } from "@/components/file-uploader";
import { RequestSchemaType } from "@/lib/schema/server/request";
import { useIsFormDirty } from "@/lib/hooks/use-form-dirty";
import { Input } from "@/components/ui/input";
import { useDialog } from "@/lib/hooks/use-dialog";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { toast } from "sonner";
import { createRequest } from "@/lib/actions/requests";

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
  const dialog = useDialog();
  const pathname = usePathname();
  const { value } = type;
  const department = "IT";
  const form = useForm<Request>({
    resolver: zodResolver(RequestSchema),
  });

  const [selection, setSelection] = useState<Selection>({
    jobType: jobs[0],
    category: jobs[0].categories[0],
    item: jobs[0].categories[0].items[0].value,
  });
  const [prio, setPrio] = useState<Priority>(priorities[0]);
  const [isLoading, setIsLoading] = useState(false);

  const { uploadFiles, progresses, isUploading, uploadedFiles } =
    useUploadFile();

  const { mutate } = useServerActionMutation(createRequest, {
    onSuccess: () => {
      dialog.setActiveDialog("");
      toast.success("Request Successful!", {
        description:
          "Your request has been submitted and is awaiting approval.",
      });
    },
    onError: (err) => {
      console.log(err);
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description: "Something went wrong, please try again later.",
      });
    },
  });
  const { setIsFormDirty } = useIsFormDirty();

  async function onSubmit(values: Request) {
    setIsLoading(true);
    await uploadFiles(values.images ?? []);

    const data: RequestSchemaType = {
      notes: values.notes,
      priority: prio.value,
      type: value,
      department: department,
      jobType: selection.jobType.value,
      category: selection.category.value,
      name: selection.item,
      path: pathname,
      files: uploadedFiles,
    };
    mutate(data);
  }

  useEffect(() => {
    if (
      form.getFieldState("notes").isDirty ||
      form.getFieldState("images").isDirty
    ) {
      setIsFormDirty(true);
    }

    return () => {
      setIsFormDirty(false);
    };
  }, [
    form.getFieldState("notes").isDirty,
    form.getFieldState("images").isDirty,
  ]);

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
          <div className="relative space-y-2 px-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={1}
                      maxRows={5}
                      placeholder="Add description..."
                      className="min-h-20 border-none px-0 py-2 focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <FileUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      maxFiles={4}
                      maxSize={4 * 1024 * 1024}
                      progresses={progresses}
                      disabled={isUploading || isLoading}
                      drop={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <MotionLayout className="flex space-x-2">
              <JobTypeOption
                selection={selection}
                setSelection={setSelection}
                isLoading={isLoading}
              />
              <PriorityOption prio={prio} setPrio={setPrio} isLoading={isLoading} />
            </MotionLayout>
          </div>
          <MotionLayout>
            <Separator className="my-4" />
            <DialogFooter>
              <div></div>
              <SubmitButton disabled={isLoading} className="w-28">
                Submit
              </SubmitButton>
            </DialogFooter>
          </MotionLayout>
        </form>
      </Form>
    </>
  );
}
