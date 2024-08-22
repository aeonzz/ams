"use client";

import React from "react";

import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon, ChevronLeft } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Request } from "@/lib/db/schema/request";
import { MotionLayout } from "@/components/layouts/motion-layout";
import { usePathname } from "next/navigation";
import { SubmitButton } from "@/components/ui/submit-button";
import JobTypeOption from "./job-type-option";
import { Category, Item, Job, jobs } from "@/config/job-list";
import PriorityOption, { priorities, Priority } from "./priority-option";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { FileUploader } from "@/components/file-uploader";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { toast } from "sonner";
import { createRequest } from "@/lib/actions/requests";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/text-area";
import { Separator } from "@/components/ui/separator";
import { RequestSchemaType } from "@/lib/schema/request";
import { type RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";
import { DialogState } from "@/lib/hooks/use-dialog-manager";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";

interface JobRequestInputProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  type: RequestTypeType;
  form: UseFormReturn<Request>;
  dialogManager: DialogState;
}

export type Selection = {
  jobType: Job;
  category: Category;
  item: string;
};

export default function JobRequestInput({
  isLoading,
  setIsLoading,
  type,
  form,
  dialogManager,
}: JobRequestInputProps) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const department = "IT";

  const [selection, setSelection] = React.useState<Selection>({
    jobType: jobs[0],
    category: jobs[0].categories[0],
    item: jobs[0].categories[0].items[0].value,
  });
  const [prio, setPrio] = React.useState<Priority>(priorities[0]);

  const { uploadFiles, progresses, isUploading, uploadedFiles } =
    useUploadFile();

  const { mutate } = useServerActionMutation(createRequest, {
    onSuccess: () => {
      setIsLoading(false);
      dialogManager.setActiveDialog(null);
      toast.success("Request Successful!", {
        description:
          "Your request has been submitted and is awaiting approval.",
      });

      queryClient.invalidateQueries({ queryKey: ["pending-req-overview"] });
      queryClient.invalidateQueries({ queryKey: ["pending-req"] });
      queryClient.invalidateQueries({ queryKey: ["total-req-overview"] });
    },
    onError: (err) => {
      console.log(err);
      setIsLoading(false);
      toast.error("Uh oh! Something went wrong.", {
        description: "Something went wrong, please try again later.",
      });
    },
  });

  async function onSubmit(values: Request) {
    setIsLoading(true);
    await uploadFiles(values.images ?? []);

    const data: RequestSchemaType = {
      notes: values.notes,
      priority: prio.value,
      dueDate: values.dueDate,
      type: type,
      department: department,
      jobType: selection.jobType.value,
      category: selection.category.value,
      name: selection.item,
      path: pathname,
      files: uploadedFiles,
    };
    mutate(data);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Job Request</DialogTitle>
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
                      disabled={isLoading}
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
              <PriorityOption
                prio={prio}
                setPrio={setPrio}
                isLoading={isLoading}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"secondary"}
                            size="sm"
                            className={cn(
                              "w-[200px] justify-start px-2 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isLoading}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Due date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                        <Select
                          onValueChange={(value) =>
                            field.onChange(addDays(new Date(), parseInt(value)))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="0">Today</SelectItem>
                            <SelectItem value="1">Tomorrow</SelectItem>
                            <SelectItem value="3">In 3 days</SelectItem>
                            <SelectItem value="7">In a week</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="rounded-md border">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
