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
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Separator } from "../../../../../components/ui/separator";
import { DialogFooter } from "../../../../../components/ui/dialog";
import { SubmitButton } from "../../../../../components/ui/submit-button";
import {
  useQuery,
  useQueryClient,
  type UseMutateAsyncFunction,
} from "@tanstack/react-query";
import { type UseFormReturn } from "react-hook-form";
import { usePathname } from "next/navigation";
import { createVenue } from "@/lib/actions/venue";
import { type CreateVenueSchema } from "@/lib/db/schema/venue";
import { FileUploader } from "../../../../../components/file-uploader";
import { DialogState } from "@/lib/hooks/use-dialog-manager";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { CreateVenueSchemaWithPath } from "@/lib/schema/venue";
import { VenueTypeSchema, type Department } from "prisma/generated/zod";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn, textTransform } from "@/lib/utils";
import CreateVenueFormSkeleton from "./create-venue-form-skeleton";
import { P } from "@/components/typography/text";
import { Textarea } from "@/components/ui/text-area";
import VenueFeatures from "./venue-features";
import { TagInput } from "@/components/ui/tag-input";

interface CreateVenueFormProps {
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createVenue>[0],
    unknown
  >;
  form: UseFormReturn<CreateVenueSchema>;
  isPending: boolean;
  isFieldsDirty: boolean;
  dialogManager: DialogState;
  queryKey?: string[];
}

export default function CreateVenueForm({
  mutateAsync,
  isPending,
  form,
  isFieldsDirty,
  setAlertOpen,
  dialogManager,
  queryKey,
}: CreateVenueFormProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [venueType, setVenueType] = React.useState(false);

  const { data, isLoading } = useQuery<Department[]>({
    queryFn: async () => {
      const res = await axios.get("/api/department/get-departments");
      return res.data.data;
    },
    queryKey: ["create-venue-department-selection-venue-table"],
  });

  const { uploadFiles, progresses, isUploading } = useUploadFile();

  async function onSubmit(values: CreateVenueSchema) {
    try {
      let uploadedFilesResult: { filePath: string }[] = [];

      uploadedFilesResult = await uploadFiles(values.imageUrl);

      const data: CreateVenueSchemaWithPath = {
        name: values.name,
        capacity: values.capacity,
        location: values.location,
        venueType: values.venueType,
        departmenId: values.departmentId,
        setupRequirements: values.setupRequirements,
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
          return "Venue created successfuly";
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
    return <CreateVenueFormSkeleton />;
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
                    placeholder="Audio Visual Room"
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Jasaan USTP"
                    disabled={isPending || isUploading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="venueType"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Venue type</FormLabel>
                  <Popover open={venueType} onOpenChange={setVenueType} modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled={isUploading || isPending}
                          role="combobox"
                          className="w-full flex-1 justify-between text-muted-foreground"
                        >
                          <span className="truncate">
                            {field.value
                              ? textTransform(field.value)
                              : "Select venue type"}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command className="max-h-72">
                        <CommandInput placeholder="Search type..." />
                        <CommandList>
                          <CommandEmpty>No type found.</CommandEmpty>
                          <CommandGroup>
                            {VenueTypeSchema.options.map((venue, index) => (
                              <CommandItem
                                value={venue}
                                key={index}
                                onSelect={() => {
                                  form.setValue("venueType", venue);
                                  setVenueType(false);
                                }}
                              >
                                {textTransform(venue)}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    venue === field.value
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
            {!queryKey && (
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Assign Managing Department</FormLabel>
                    <Popover open={open} onOpenChange={setOpen} modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={isLoading || isPending || isUploading}
                            className="w-full flex-1 justify-between text-muted-foreground"
                          >
                            {field.value ? (
                              data?.find(
                                (department) => department.id === field.value
                              )?.name
                            ) : (
                              <P className="max-w-40 truncate">
                                Select a department to manage
                              </P>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search department..." />
                          <CommandList>
                            <CommandEmpty>
                              {isLoading
                                ? "Loading..."
                                : "No department found."}
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
          </div>
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    type="number"
                    placeholder="24"
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
            name="setupRequirements"
            render={({ field }) => (
              <FormItem className="flex flex-grow flex-col">
                <FormLabel className="text-left">Setup Requirements</FormLabel>
                <FormControl>
                  <TagInput
                    placeholder="Enter one or more items"
                    disabled={isPending || isUploading}
                    value={field.value || []}
                    onChange={field.onChange}
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
                <FormLabel>Venue image</FormLabel>
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
          <FormField
            control={form.control}
            name="rulesAndRegulations"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    rows={1}
                    maxRows={10}
                    placeholder="Rules and Regulations..."
                    className="min-h-[150px] flex-grow resize-none placeholder:text-sm"
                    disabled={isUploading || isPending}
                    {...field}
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
