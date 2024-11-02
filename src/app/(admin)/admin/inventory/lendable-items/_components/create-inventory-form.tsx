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
import {
  useQuery,
  useQueryClient,
  type UseMutateAsyncFunction,
} from "@tanstack/react-query";
import { type UseFormReturn } from "react-hook-form";
import { usePathname } from "next/navigation";
import { FileUploader } from "@/components/file-uploader";
import { DialogState } from "@/lib/hooks/use-dialog-manager";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { Textarea } from "@/components/ui/text-area";
import { createInventory } from "@/lib/actions/inventory";
import { type CreateInventoryItemSchema } from "@/lib/db/schema/inventory";
import { type CreateInventoryItemSchemaWithPath } from "@/lib/schema/resource/returnable-resource";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { type Department } from "prisma/generated/zod";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLendableDepartments } from "@/lib/hooks/use-lendable-departments";

interface CreateInventoryFormProps {
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createInventory>[0],
    unknown
  >;
  form: UseFormReturn<CreateInventoryItemSchema>;
  isPending: boolean;
  isFieldsDirty: boolean;
  dialogManager: DialogState;
  queryKey?: string[];
}

export default function CreateInventoryForm({
  mutateAsync,
  isPending,
  form,
  isFieldsDirty,
  setAlertOpen,
  dialogManager,
  queryKey,
}: CreateInventoryFormProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data, isLoading } = useLendableDepartments();

  const { uploadFiles, progresses, isUploading } = useUploadFile();

  async function onSubmit(values: CreateInventoryItemSchema) {
    try {
      let uploadedFilesResult: { filePath: string }[] = [];

      uploadedFilesResult = await uploadFiles(values.imageUrl);

      const data: CreateInventoryItemSchemaWithPath = {
        name: values.name,
        description: values.description,
        inventoryCount: values.inventoryCount,
        departmentId: values.departmentId,
        path: pathname,
        imageUrl: uploadedFilesResult.map(
          (result: { filePath: string }) => result.filePath
        ),
      };

      toast.promise(mutateAsync(data), {
        loading: "Creating...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: queryKey,
          });
          dialogManager.setActiveDialog(null);
          return "Inventory created successfuly";
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
            name="inventoryCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inventory Count</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    type="number"
                    placeholder="1"
                    disabled={isPending || isUploading}
                    {...field}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value.slice(0, 3);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!queryKey && (
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Department</FormLabel>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled={isUploading || isPending || isLoading}
                          role="combobox"
                          className="w-full flex-1 justify-between"
                        >
                          {field.value ? (
                            <p className="truncate">
                              {
                                data?.find(
                                  (department) => department.id === field.value
                                )?.name
                              }
                            </p>
                          ) : (
                            "Select managing department"
                          )}
                          {isLoading ? (
                            <LoadingSpinner />
                          ) : (
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command className="max-h-72">
                        <CommandInput placeholder="Search type..." />
                        <CommandList>
                          <CommandEmpty>No type found.</CommandEmpty>
                          <CommandGroup>
                            {data?.map((department, index) => (
                              <CommandItem
                                value={department.id}
                                key={index}
                                onSelect={() => {
                                  field.onChange(department.id);
                                }}
                              >
                                {department.name}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    department.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={1}
                    maxRows={5}
                    placeholder="description..."
                    className="min-h-[100px] flex-grow resize-none text-sm"
                    disabled={isPending}
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
                <FormLabel>Inventory image</FormLabel>
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
