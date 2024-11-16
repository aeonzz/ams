"use client";

import React from "react";
import { ImageUp } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/file-uploader";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { z } from "zod";
import { updateUser } from "@/lib/actions/users";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitButton } from "../ui/submit-button";
import { Separator } from "../ui/separator";

const ImageUpload = z.object({
  imageUrl: z.array(z.instanceof(File), {
    required_error: "Image is required",
  }),
});

export default function UploadProfileDialog() {
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof ImageUpload>>({
    resolver: zodResolver(ImageUpload),
    defaultValues: {
      imageUrl: [],
    },
  });

  const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile(
    "imageUploader",
    {
      defaultUploadedFiles: [],
    }
  );
  const { mutateAsync, isPending } = useServerActionMutation(updateUser);

  async function onSubmit(values: z.infer<typeof ImageUpload>) {
    try {
      const uploadAndSubmit = async () => {
        let currentFiles = uploadedFiles;

        currentFiles = await onUpload(values.imageUrl);

        await mutateAsync({
          profileUrl: currentFiles[0].url,
          path: "/settings/account",
        });
      };

      toast.promise(uploadAndSubmit(), {
        loading: "Saving...",
        success: () => {
          setOpen(false);
          form.reset();
          return "Avatar updated successfully";
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="expandIcon" size="sm">
          Upload
          <ImageUp className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          if (isUploading) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Upload Avatar</DialogTitle>
          <DialogDescription>
            Drag and drop your avatar here or click to browse.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-0">
          <Form {...form}>
            <form
              autoComplete="off"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
            >
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="px-3">
                    <FormControl>
                      <FileUploader
                        value={field.value}
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
              <DialogFooter>
                <div></div>
                <div className="flex space-x-3">
                  <SubmitButton
                    disabled={isPending || isUploading}
                    type="submit"
                    className="w-20"
                  >
                    Save
                  </SubmitButton>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
