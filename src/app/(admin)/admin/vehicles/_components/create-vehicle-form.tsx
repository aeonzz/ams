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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { DialogState } from "@/lib/hooks/use-dialog-manager";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { CreateVenueSchemaWithPath } from "@/lib/schema/venue";
import { type CreateVehicleSchema } from "@/lib/db/schema/vehicle";
import { createVehicle } from "@/lib/actions/vehicle";
import { type CreateVehicleSchemaWithPath } from "@/lib/schema/vehicle";
import { FileUploader } from "@/components/file-uploader";
import type { Department } from "prisma/generated/zod";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import CreateVehicleFormSkeleton from "./create-vehicle-form-skeleton";
import NumberInput from "@/components/number-input";
import { useTransportDepartments } from "@/lib/hooks/use-transport-depratments";

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
  queryKey?: string[];
}

export default function CreateVehicleForm({
  mutateAsync,
  isPending,
  form,
  isFieldsDirty,
  setAlertOpen,
  dialogManager,
  queryKey,
}: CreateVenueFehiclerops) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data, isLoading } = useTransportDepartments();

  const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile(
    "imageUploader",
    { defaultUploadedFiles: [] }
  );

  async function onSubmit(values: CreateVehicleSchema) {
    try {
      const uploadAndSubmit = async () => {
        let currentFiles = uploadedFiles;

        currentFiles = await onUpload(values.imageUrl);

        const data: CreateVehicleSchemaWithPath = {
          name: values.name,
          type: values.type,
          departmentId: values.departmentId,
          imageUrl: currentFiles.map((result) => result.url),
          capacity: values.capacity,
          licensePlate: values.licensePlate,
          path: pathname,
        };

        await mutateAsync(data);
      };

      toast.promise(uploadAndSubmit(), {
        loading: "Creating...",
        success: () => {
          queryClient.invalidateQueries({
            queryKey: queryKey,
          });
          dialogManager.setActiveDialog(null);
          return "Vehicle created successfully";
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

  if (isLoading) {
    return <CreateVehicleFormSkeleton />;
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
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <NumberInput
                    value={field.value}
                    min={0}
                    max={100}
                    disabled={isPending || isUploading}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    className="w-full justify-between"
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
                  <FormLabel>Assign Managing Department</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          disabled={isLoading || isPending}
                          className="w-full justify-between text-muted-foreground"
                        >
                          {field.value
                            ? data?.find(
                                (department) => department.id === field.value
                              )?.name
                            : "Select a department to manage"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search department..." />
                        <CommandList>
                          <CommandEmpty>
                            {isLoading ? "Loading..." : "No department found."}
                          </CommandEmpty>
                          <CommandGroup>
                            <div className="scroll-bar max-h-40 overflow-y-auto">
                              {data?.map((department) => (
                                <CommandItem
                                  value={department.name}
                                  key={department.id}
                                  onSelect={() => {
                                    field.onChange(
                                      department.id === field.value
                                        ? ""
                                        : department.id
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === department.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {department.name}
                                </CommandItem>
                              ))}
                            </div>
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
