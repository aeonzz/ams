"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { FileUploader } from "@/components/file-uploader";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { Textarea } from "@/components/ui/text-area";
import { updateInventory } from "@/lib/actions/inventory";
import {
  type ExtendedUpdateInventoryItemSchema,
  ExtendedUpdateInventoryItemServerSchema,
} from "@/lib/schema/resource/returnable-resource";
import type { InventorySubItemType } from "@/lib/types/item";
import {
  updateInventorySubItemSchema,
  type UpdateInventorySubItemSchema,
} from "@/lib/db/schema/inventory-item";
import { updateInventorySubItem } from "@/lib/actions/inventoryItem";

interface UpdateInventorySubItemSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  inventory: InventorySubItemType;
}

export function UpdateInventorySubItemSheet({
  inventory,
  ...props
}: UpdateInventorySubItemSheetProps) {
  const pathname = usePathname();
  const form = useForm<UpdateInventorySubItemSchema>({
    resolver: zodResolver(updateInventorySubItemSchema),
    defaultValues: {
      subName: inventory.name,
      serialNumber: inventory.serialNumber ?? "",
      imageUrl: undefined,
    },
  });

  const { dirtyFields } = useFormState({ control: form.control });

  const { isPending, mutateAsync } = useServerActionMutation(updateInventorySubItem);
  const { uploadFiles, progresses, isUploading } = useUploadFile();

  React.useEffect(() => {
    form.reset({
      subName: inventory.name,
      serialNumber: inventory.serialNumber ?? "",
      imageUrl: undefined,
    });
  }, [inventory, form, props.open]);

  async function onSubmit(values: UpdateInventorySubItemSchema) {
    const { imageUrl, ...rest } = values;
    try {
      let uploadedFilesResult: { filePath: string }[] = [];

      if (values.imageUrl && values.imageUrl.length > 0) {
        uploadedFilesResult = await uploadFiles(values.imageUrl);
      }

      const data: ExtendedUpdateInventoryItemSchema = {
        ...rest,
        id: inventory.id,
        path: pathname,
        imageUrl: uploadedFilesResult.map(
          (result: { filePath: string }) => result.filePath
        ),
      };

      toast.promise(mutateAsync(data), {
        loading: "Updating...",
        success: () => {
          props.onOpenChange?.(false);
          return "Equipment updated succesfully.";
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
    <Sheet {...props}>
      <SheetContent
        onInteractOutside={(e) => {
          if (isPending) {
            e.preventDefault();
          }
        }}
      >
        <SheetHeader className="text-left">
          <SheetTitle>Update equipment</SheetTitle>
          <SheetDescription>
            Update the equipment details and save the changes
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-screen flex-col justify-between"
          >
            <div className="scroll-bar relative max-h-[75vh] space-y-2 overflow-y-auto px-4">
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
            <div>
              <Separator className="my-2" />
              <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending || isUploading}
                  >
                    Cancel
                  </Button>
                </SheetClose>
                <Button
                  disabled={
                    Object.keys(dirtyFields).length === 0 ||
                    isPending ||
                    isUploading
                  }
                  type="submit"
                  className="w-20"
                >
                  Save
                </Button>
              </SheetFooter>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
