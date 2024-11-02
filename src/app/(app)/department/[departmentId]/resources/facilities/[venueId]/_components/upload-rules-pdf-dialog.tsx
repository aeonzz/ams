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
import {
  UploadVenueRulesFileWithPath,
  type UploadFileSchemaServerWithPath,
} from "@/lib/schema/file";
import { usePathname } from "next/navigation";
import { type FilePurposeType } from "prisma/generated/zod/inputTypeSchemas/FilePurposeSchema";
import { updateVenueRulesFile } from "@/lib/actions/file";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { type DepartmentWithRelations } from "prisma/generated/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";

interface UploadRulesPdfDialogProps {
  file: string | null;
  venueId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function UploadRulesPdfDialog({
  file,
  venueId,
  setOpen,
  open,
}: UploadRulesPdfDialogProps) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
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
    useServerActionMutation(updateVenueRulesFile);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
    }
  };

  async function onSubmit(values: UploadFileSchema) {
    try {
      let uploadedFilesResult: { filePath: string }[] = [];

      uploadedFilesResult = await uploadFiles(values.file);

      const data: UploadVenueRulesFileWithPath = {
        path: pathname,
        venueId: venueId,
        url: uploadedFilesResult.map(
          (result: { filePath: string }) => result.filePath
        ),
      };

      toast.promise(mutateAsync(data), {
        loading: "Saving...",
        success: () => {
          handleOpenChange(false);
          queryClient.invalidateQueries({
            queryKey: [venueId],
          });
          return "File saved successfully";
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
    if (open) {
      form.reset();
    }
  }, [open]);

  return (
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
      className="flex max-h-[90vh] max-w-2xl flex-col"
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
        <DialogTitle>Rules and Regulation</DialogTitle>
      </DialogHeader>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "view" | "upload")}
        className="h-full px-3"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">View Form</TabsTrigger>
          <TabsTrigger value="upload">Upload New Form</TabsTrigger>
        </TabsList>
        <TabsContent value="view">
          {file ? (
            <div className="px-1 py-1">
              {/* <h3 className="mb-2 text-lg font-semibold">
                Current {capability.name} Form
              </h3> */}
              <iframe src={file} className="h-[65vh] w-full border" />
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
                      <FormLabel>Upload File</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={field.value}
                          accept={{ "application/pdf": [] }}
                          onValueChange={field.onChange}
                          maxFiles={1}
                          maxSize={12 * 1024 * 1024}
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
                  Save
                </SubmitButton>
              </DialogFooter>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
