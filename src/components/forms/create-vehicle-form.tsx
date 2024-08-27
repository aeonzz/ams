"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { DialogFooter } from "../ui/dialog";
import { SubmitButton } from "../ui/submit-button";
import { type UseMutateAsyncFunction } from "@tanstack/react-query";
import { type UseFormReturn } from "react-hook-form";
import { usePathname } from "next/navigation";
import { FileUploader } from "../file-uploader";
import { DialogState } from "@/lib/hooks/use-dialog-manager";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { CreateVenueSchemaWithPath } from "@/lib/schema/venue";
import { type CreateVehicleSchema } from "@/lib/db/schema/vehicle";
import { createVehicle } from "@/lib/actions/vehicle";
import { type CreateVehicleSchemaWithPath } from "@/lib/schema/vehicle";

interface CreateVenueFehiclerops {
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createVehicle>[0],
    unknown
  >;
  form: UseFormReturn<CreateVehicleSchema>;
  isPending: boolean;
  isFieldsDirty: boolean;
  dialogManager: DialogState;
}

export default function CreateVehicleForm({
  mutateAsync,
  isPending,
  form,
  isFieldsDirty,
  setAlertOpen,
  dialogManager,
}: CreateVenueFehiclerops) {
  const pathname = usePathname();

  const { uploadFiles, progresses, isUploading } = useUploadFile();

  async function onSubmit(values: CreateVehicleSchema) {
    try {
      let uploadedFilesResult: { filePath: string }[] = [];

      uploadedFilesResult = await uploadFiles(values.imageUrl);

      const data: CreateVehicleSchemaWithPath = {
        name: values.name,
        type: values.type,
        imageUrl: uploadedFilesResult.map(
          (result: { filePath: string }) => result.filePath
        ),
        capacity: values.capacity,
        licensePlate: values.licensePlate,
        path: pathname,
      };

      toast.promise(mutateAsync(data), {
        loading: "Submitting...",
        success: () => {
          dialogManager.setActiveDialog(null);
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

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="scroll-bar flex max-h-[55vh] flex-col gap-2 overflow-y-auto px-4 py-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Campus Shuttle"
                    disabled={isPending || isUploading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="e.g., Bus, Van, Car"
                    disabled={isPending || isUploading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="licensePlate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License plate</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="ABC 1234"
                    disabled={isPending || isUploading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    type="number"
                    placeholder="24 seats"
                    disabled={isPending || isUploading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Vehicle image</FormLabel>
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
        </div>
        <Separator className="my-4" />
        <DialogFooter>
          <div></div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                if (isFieldsDirty) {
                  setAlertOpen(true);
                } else {
                  dialogManager.setActiveDialog(null);
                }
              }}
              disabled={isPending || isUploading}
            >
              Cancel
            </Button>
            <SubmitButton
              disabled={isPending || isUploading}
              type="submit"
              className="w-20"
            >
              Create
            </SubmitButton>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}
