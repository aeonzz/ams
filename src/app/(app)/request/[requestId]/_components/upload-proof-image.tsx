"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitButton } from "@/components/ui/submit-button";
import { FileUploader } from "@/components/file-uploader";
import { z } from "zod";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { toast } from "sonner";
import { uploadProofImages } from "@/lib/actions/job";
import { usePathname } from "next/navigation";
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

const ImageUpload = z.object({
  proofImages: z.array(z.instanceof(File), {
    required_error: "Image is required",
  }),
});

interface UploadProofImageProps {
  requestId: string;
}

export default function UploadProofImage({ requestId }: UploadProofImageProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof ImageUpload>>({
    resolver: zodResolver(ImageUpload),
    defaultValues: {
      proofImages: [],
    },
  });

  const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile(
    "imageUploader",
    {
      defaultUploadedFiles: [],
    }
  );
  const { mutateAsync, isPending } = useServerActionMutation(uploadProofImages);

  async function onSubmit(values: z.infer<typeof ImageUpload>) {
    setOpen(false);
    try {
      const uploadAndSubmit = async () => {
        let currentFiles = uploadedFiles;

        currentFiles = await onUpload(values.proofImages);

        await mutateAsync({
          proofImages: currentFiles.map((i) => i.url),
          path: pathname,
          requestId: requestId,
        });
      };

      toast.promise(uploadAndSubmit(), {
        loading: "Saving...",
        success: () => {
          form.reset();
          return "Saved";
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

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="proofImages"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUploader
                  value={field.value}
                  onValueChange={field.onChange}
                  maxFiles={2}
                  maxSize={4 * 1024 * 1024}
                  progresses={progresses}
                  disabled={isPending || isUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <SubmitButton
                disabled={isPending || isUploading}
                type="button"
                variant="secondary"
                size="sm"
                className="w-20"
              >
                Save
              </SubmitButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Confirming will upload these images and they cannot be edited
                  afterwards.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </Form>
  );
}
