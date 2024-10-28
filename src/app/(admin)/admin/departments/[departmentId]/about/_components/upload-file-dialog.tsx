"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDialogManager } from "@/lib/hooks/use-dialog-manager";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { File, X } from "lucide-react";
import { type UploadFileSchema, uploadFileSchema } from "@/lib/db/schema/file";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploader } from "@/components/file-uploader";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { toast } from "sonner";
import { type UploadFileSchemaServerWithPath } from "@/lib/schema/file";
import { usePathname } from "next/navigation";
import { type FilePurposeType } from "prisma/generated/zod/inputTypeSchemas/FilePurposeSchema";
import { updateDepartmentFile } from "@/lib/actions/file";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Capability } from ".";
import { type DepartmentWithRelations } from "prisma/generated/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";

interface UploadFileDialogProps {
  data: DepartmentWithRelations;
  departmentId: string;
  capability: Capability;
}

export default function UploadFileDialog({
  data,
  departmentId,
  capability,
}: UploadFileDialogProps) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"view" | "upload">("view");

  const form = useForm<UploadFileSchema>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const { dirtyFields } = useFormState({ control: form.control });
  const isFieldsDirty = Object.keys(dirtyFields).length > 0;

  const { uploadFiles, progresses, isUploading, uploadedFiles } =
    useUploadFile("/api/file/pdf");

  const { mutateAsync, isPending } =
    useServerActionMutation(updateDepartmentFile);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
    }
  };

  async function onSubmit(values: UploadFileSchema) {
    try {
      let uploadedFilesResult: { filePath: string }[] = [];

      uploadedFilesResult = await uploadFiles(values.file);

      const data: UploadFileSchemaServerWithPath = {
        path: pathname,
        filePurpose: capability.filePurpose,
        departmentId: departmentId,
        url: uploadedFilesResult.map(
          (result: { filePath: string }) => result.filePath
        ),
      };

      toast.promise(mutateAsync(data), {
        loading: "Submitting...",
        success: () => {
          handleOpenChange(false);
          queryClient.invalidateQueries({
            queryKey: [departmentId],
          });
          return "Your request has been submitted and is awaiting approval.";
        },
        error: (err) => {
          console.log(err);
          return err.message;
        },
      });
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred during submission. Please try again.");
    }
  }

  React.useEffect(() => {
    form.reset();
  }, [open]);

  const existingFile = data.files.find(
    (file) => file.filePurpose === capability.filePurpose
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          <File className="mr-1 size-5" />
          <span>Request Form</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          if (isPending) {
            e.preventDefault();
          }
          if (isFieldsDirty && !isPending) {
            e.preventDefault();
            setAlertOpen(true);
          }
        }}
        className="max-w-2xl"
        isLoading={isPending}
      >
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          {isFieldsDirty && !isPending && (
            <AlertDialogTrigger disabled={isPending} asChild>
              <button
                disabled={isPending}
                className="absolute right-4 top-4 z-50 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 active:scale-95 disabled:pointer-events-none"
              >
                <X className="h-5 w-5" />
              </button>
            </AlertDialogTrigger>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Are you sure you want to leave?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setOpen(false);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <DialogHeader>
          <DialogTitle>{capability.name} Form</DialogTitle>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "view" | "upload")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">View Form</TabsTrigger>
            <TabsTrigger value="upload">Upload New Form</TabsTrigger>
          </TabsList>
          <TabsContent value="view">
            {existingFile ? (
              <div className="px-4 py-1">
                <h3 className="mb-2 text-lg font-semibold">
                  Current {capability.name} Form
                </h3>
                <iframe
                  src={existingFile.url}
                  className="h-[400px] w-full border"
                />
              </div>
            ) : (
              <div className="flex min-h-[55vh] items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No form uploaded yet.
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="upload">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="scroll-bar flex max-h-[55vh] gap-6 overflow-y-auto px-4 py-1">
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Upload Request Form</FormLabel>
                        <FormControl>
                          <FileUploader
                            value={field.value}
                            accept={{ "application/pdf": [] }}
                            onValueChange={field.onChange}
                            maxFiles={1}
                            maxSize={4 * 1024 * 1024}
                            progresses={progresses}
                            disabled={isPending || isUploading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator className="my-4" />
                <DialogFooter>
                  <div></div>
                  <SubmitButton
                    disabled={isUploading || isPending}
                    className="w-28"
                  >
                    Submit
                  </SubmitButton>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
