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
import { type SupplyItemCategory, type Department } from "prisma/generated/zod";
import axios from "axios";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn, isDateInPast } from "@/lib/utils";
import type { CreateSupplyItemSchema } from "@/lib/db/schema/supply";
import { CreateSupplyItemSchemaServerWithPath } from "@/lib/schema/resource/supply-resource";
import { createSupplyitem } from "@/lib/actions/supply";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useSupplyItemCategory } from "@/lib/hooks/use-supply-item-category";
import { useSupplyDepartments } from "@/lib/hooks/use-supply-departments";
import NumberInput from "@/components/number-input";

export const UnitTypeSchema = [
  "Pieces",
  "Boxes",
  "Meters",
  "Packs",
  "Sets",
  "Rolls",
  "Bottles",
  "Cans",
  "Reams",
  "Dozens",
] as const;

interface CreateSupplyItemFormProps {
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createSupplyitem>[0],
    unknown
  >;
  form: UseFormReturn<CreateSupplyItemSchema>;
  isPending: boolean;
  isFieldsDirty: boolean;
  dialogManager: DialogState;
  queryKey?: string[];
}

export default function CreateSupplyItemForm({
  mutateAsync,
  isPending,
  form,
  isFieldsDirty,
  setAlertOpen,
  dialogManager,
  queryKey,
}: CreateSupplyItemFormProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data, isLoading } = useSupplyDepartments();

  const { data: itemCategory, isLoading: isLoadingItemCategory } =
    useSupplyItemCategory();

  const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile(
    "imageUploader",
    { defaultUploadedFiles: [] }
  );

  async function onSubmit(values: CreateSupplyItemSchema) {
    const { imageUrl, quantity, ...rest } = values;
    try {
      const uploadAndSubmit = async () => {
        let currentFiles = uploadedFiles;

        currentFiles = await onUpload(values.imageUrl);

        const data: CreateSupplyItemSchemaServerWithPath = {
          ...rest,
          quantity: quantity,
          departmentId: values.departmentId,
          path: pathname,
          imageUrl: currentFiles.map((result) => result.url),
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
                    placeholder="Pen"
                    disabled={isPending || isUploading}
                    {...field}
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
                          disabled={
                            isUploading ||
                            isPending ||
                            isLoading ||
                            isLoadingItemCategory
                          }
                          role="combobox"
                          className={cn(
                            "w-full flex-1 justify-between",
                            !field.value && "text-muted-foreground"
                          )}
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
                          {isLoading || isLoadingItemCategory ? (
                            <LoadingSpinner />
                          ) : (
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command className="max-h-72">
                        <CommandInput placeholder="Search department..." />
                        <CommandList>
                          <CommandEmpty>No department found.</CommandEmpty>
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
            name="quantity"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <NumberInput
                    value={field.value}
                    min={0}
                    max={200}
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
          <FormField
            control={form.control}
            name="lowStockThreshold"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Low Stock Threshhold</FormLabel>
                <FormControl>
                  <NumberInput
                    value={field.value}
                    min={0}
                    max={200}
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
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="flex flex-1 flex-col">
                  <FormLabel>Unit</FormLabel>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled={isUploading || isPending}
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <span className="truncate">
                            {field.value ? field.value : "Select unit type"}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[230px] p-0" align="start">
                      <Command className="max-h-72">
                        <CommandInput placeholder="Search unit..." />
                        <CommandList>
                          <CommandEmpty>No unit found.</CommandEmpty>
                          <CommandGroup>
                            {UnitTypeSchema.map((unit, index) => (
                              <CommandItem
                                value={unit}
                                key={index}
                                onSelect={() => {
                                  field.onChange(unit);
                                }}
                              >
                                {unit}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    unit === field.value
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
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-1 flex-col">
                  <FormLabel>Item Category</FormLabel>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled={
                            isUploading ||
                            isPending ||
                            isLoading ||
                            isLoadingItemCategory
                          }
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <span className="truncate">
                            {field.value
                              ? itemCategory?.find(
                                  (item) => item.id === field.value
                                )?.name
                              : "Select category"}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[230px] p-0" align="start">
                      <Command className="max-h-72">
                        <CommandInput placeholder="Search category..." />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {itemCategory?.map((category) => (
                              <CommandItem
                                value={category.id}
                                key={category.id}
                                onSelect={() => {
                                  field.onChange(category.id);
                                }}
                              >
                                {category.name}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    category.id === field.value
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
          </div>
          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem className="flex flex-1 flex-col">
                <FormLabel>
                  Expiration Date{" "}
                  <span className="text-xs text-muted-foreground">
                    (Optional)
                  </span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start px-2 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isUploading || isPending}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Date</span>
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
                        <SelectItem value="3">In 3 days</SelectItem>
                        <SelectItem value="5">In 5 days</SelectItem>
                        <SelectItem value="7">In a week</SelectItem>
                        <SelectItem value="30">In a month</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="rounded-md border">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={isDateInPast}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description{" "}
                  <span className="text-xs text-muted-foreground">
                    (Optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={1}
                    maxRows={5}
                    placeholder="description..."
                    className="min-h-[100px] flex-grow resize-none text-sm"
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
