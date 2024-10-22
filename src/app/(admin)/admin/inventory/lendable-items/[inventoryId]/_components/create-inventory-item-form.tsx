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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DialogFooter } from "@/components/ui/dialog";
import { SubmitButton } from "@/components/ui/submit-button";
import { type UseMutateAsyncFunction } from "@tanstack/react-query";
import { type UseFormReturn } from "react-hook-form";
import { usePathname } from "next/navigation";
import { DialogState } from "@/lib/hooks/use-dialog-manager";
import { type CreateInventoryItemSchema } from "@/lib/db/schema/inventory-item";
import { createInventorySubItem } from "@/lib/actions/inventoryItem";
import { FileUploader } from "@/components/file-uploader";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import type { ExtendCreateInventoryItemSchema } from "@/lib/schema/resource/returnable-resource";

interface CreateInventoryFormProps {
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createInventorySubItem>[0],
    unknown
  >;
  form: UseFormReturn<CreateInventoryItemSchema>;
  isPending: boolean;
  isFieldsDirty: boolean;
  dialogManager: DialogState;
  inventoryId: string;
}

export default function CreateInventoryItemForm({
  mutateAsync,
  isPending,
  form,
  isFieldsDirty,
  setAlertOpen,
  dialogManager,
  inventoryId,
}: CreateInventoryFormProps) {
  const pathname = usePathname();

  const { uploadFiles, progresses, isUploading } = useUploadFile();

  async function onSubmit(values: CreateInventoryItemSchema) {
    const { imageUrl, ...rest } = values;
    try {
      let uploadedFilesResult: { filePath: string }[] = [];

      uploadedFilesResult = await uploadFiles(values.imageUrl);

      const data: ExtendCreateInventoryItemSchema = {
        ...rest,
        path: pathname,
        imageUrl: uploadedFilesResult.map(
          (result: { filePath: string }) => result.filePath
        ),
        inventoryId: inventoryId,
      };

      toast.promise(mutateAsync(data), {
        loading: "Creating...",
        success: () => {
          dialogManager.setActiveDialog(null);
          return "InventoryItem created successfuly";
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
            name="subName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Projector"
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
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Projector"
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
                <FormLabel>Item image</FormLabel>
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
