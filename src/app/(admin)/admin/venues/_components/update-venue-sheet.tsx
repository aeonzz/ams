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
import {
  type Department,
  VenueStatusSchema,
  type Venue,
  VenueTypeSchema,
} from "prisma/generated/zod";
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
import { Input } from "@/components/ui/input";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  updateVenueSchema,
  type UpdateVenueSchema,
} from "@/lib/db/schema/venue";
import { FileUploader } from "@/components/file-uploader";
import { useUploadFile } from "@/lib/hooks/use-upload-file";
import { type ExtendedUpdateVenueServerSchema } from "@/lib/schema/venue";
import { updateVenue } from "@/lib/actions/venue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, getVenueStatusIcon, textTransform } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { UpdateVenueSheetSkeleton } from "./update-venue-sheet-skeleton";
import VenueFeatures from "./venue-features";
import { VenueFeaturesType } from "@/lib/types/venue";

interface UpdateDeparVenueProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  venue: Venue;
}

export function UpdateVenueSheet({ venue, ...props }: UpdateDeparVenueProps) {
  const [open, setOpen] = React.useState(false);
  const [venueType, setVenueType] = React.useState(false);
  const [featuresError, setFeaturesError] = React.useState<string | undefined>(
    undefined
  );
  const pathname = usePathname();
  const form = useForm<UpdateVenueSchema>({
    resolver: zodResolver(updateVenueSchema),
    defaultValues: {
      name: venue.name,
      location: venue.location,
      capacity: venue.capacity,
      status: venue.status,
      departmentId: venue.departmentId,
      imageUrl: undefined,
      venueType: venue.venueType,
      features: Array.isArray(venue.features)
        ? (venue.features as VenueFeaturesType[]).map((feature) => feature.name)
        : undefined,
    },
  });

  const { data, isLoading } = useQuery<Department[]>({
    queryFn: async () => {
      const res = await axios.get("/api/department/get-departments");
      return res.data.data;
    },
    queryKey: ["update-venue-department-selection-venue-table"],
  });

  const { dirtyFields } = useFormState({ control: form.control });

  const { isPending, mutateAsync } = useServerActionMutation(updateVenue);
  const { uploadFiles, progresses, isUploading } = useUploadFile();

  React.useEffect(() => {
    form.reset({
      name: venue.name,
      location: venue.location,
      capacity: venue.capacity,
      status: venue.status,
      departmentId: venue.departmentId,
      imageUrl: undefined,
      venueType: venue.venueType,
      features: Array.isArray(venue.features)
        ? (venue.features as VenueFeaturesType[]).map((feature) => feature.name)
        : undefined,
    });
  }, [venue, form, props.open]);

  async function onSubmit(values: UpdateVenueSchema) {
    if (featuresError) {
      return;
    }
    try {
      let uploadedFilesResult: { filePath: string }[] = [];

      if (values.imageUrl && values.imageUrl.length > 0) {
        uploadedFilesResult = await uploadFiles(values.imageUrl);
      }

      const data: ExtendedUpdateVenueServerSchema = {
        id: venue.id,
        path: pathname,
        name: values.name,
        departmentId: values.departmentId,
        venueType: values.venueType,
        features: values.features,
        location: values.location,
        capacity: values.capacity,
        status: values.status,
        imageUrl: uploadedFilesResult.map(
          (result: { filePath: string }) => result.filePath
        ),
      };

      toast.promise(mutateAsync(data), {
        loading: "Updating...",
        success: () => {
          props.onOpenChange?.(false);
          return "Venue updated succesfully.";
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
          <SheetTitle>Update venue</SheetTitle>
          <SheetDescription>
            Update the venue details and save the changes
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <UpdateVenueSheetSkeleton />
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex h-screen flex-col justify-between"
            >
              <div className="scroll-bar relative max-h-[75vh] space-y-2 overflow-y-auto px-4">
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="bg-transparent capitalize"
                            disabled={isPending || isUploading}
                          >
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-secondary">
                          <SelectGroup>
                            {VenueStatusSchema.options.map((status) => {
                              const { icon: Icon, variant } =
                                getVenueStatusIcon(status);
                              return (
                                <SelectItem
                                  key={status}
                                  value={status}
                                  className="capitalize"
                                >
                                  <Badge variant={variant}>
                                    <Icon className="mr-1 size-4" />
                                    {textTransform(status)}
                                  </Badge>
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                                    (department) =>
                                      department.id === field.value
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
                <FormField
                  control={form.control}
                  name="venueType"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Venue type</FormLabel>
                      <Popover open={venueType} onOpenChange={setVenueType}>
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
                                      field.onChange(
                                        venue === field.value ? "" : venue
                                      );
                                      // form.setValue("venueType", venue);
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
                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <VenueFeatures
                      field={field}
                      disabled={isPending || isUploading}
                      error={featuresError}
                      setError={setFeaturesError}
                    />
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
        )}
      </SheetContent>
    </Sheet>
  );
}
