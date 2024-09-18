"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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

import { Department, DepartmentTypeSchema } from "prisma/generated/zod";
import { Input } from "@/components/ui/input";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  updateDepartmentSchema,
  UpdateDepartmentSchema,
} from "@/lib/schema/department";
import { updateDepartment } from "@/lib/actions/department";
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
import { Textarea } from "@/components/ui/text-area";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn, textTransform } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface UpdateDepartmentSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  department: Department;
}

export function UpdateDepartmentSheet({
  department,
  ...props
}: UpdateDepartmentSheetProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const form = useForm<UpdateDepartmentSchema>({
    resolver: zodResolver(updateDepartmentSchema),
    defaultValues: {
      name: department.name,
      acceptsJobs: department.acceptsJobs,
      departmentType: department.departmentType,
      description: department.description ?? "",
      responsibilities: department.responsibilities ?? "",
    },
  });

  const { dirtyFields } = useFormState({ control: form.control });

  const { isPending, mutateAsync } = useServerActionMutation(updateDepartment);

  React.useEffect(() => {
    form.reset({
      name: department.name,
      acceptsJobs: department.acceptsJobs,
      departmentType: department.departmentType,
      description: department.description ?? "",
      responsibilities: department.responsibilities ?? "",
    });
  }, [department, form]);

  function onSubmit(values: UpdateDepartmentSchema) {
    const data = {
      ...values,
      path: pathname,
      id: department.id,
    };

    toast.promise(mutateAsync(data), {
      loading: "Saving...",
      success: () => {
        props.onOpenChange?.(false);
        return "User updated successfully";
      },
      error: (err) => {
        console.log(err);
        return "Something went wrong, please try again later.";
      },
    });
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
          <SheetTitle>Update task</SheetTitle>
          <SheetDescription>
            Update the task details and save the changes
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-screen flex-col justify-between"
          >
            <div className="relative space-y-2 px-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Information Technology"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Description..."
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
                name="responsibilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsibilities</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={1}
                        maxRows={10}
                        placeholder="responsibilities..."
                        className="min-h-[100px] flex-grow resize-none"
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
                name="departmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Type</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                          >
                            {field.value
                              ? textTransform(
                                  DepartmentTypeSchema.options.find(
                                    (option) => option === field.value
                                  ) || "Select department type"
                                )
                              : "Select department type"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search department type..." />
                          <CommandList>
                            <CommandEmpty>
                              No department type found.
                            </CommandEmpty>
                            <CommandGroup>
                              {DepartmentTypeSchema.options.map((option) => (
                                <CommandItem
                                  key={option}
                                  onSelect={() => {
                                    field.onChange(
                                      option === field.value ? "" : option
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === option
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {textTransform(option)}
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
                name="acceptsJobs"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Accept Jobs</FormLabel>
                      <FormDescription className="text-xs">
                        Indicates whether this department can handle job
                        requests.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Separator className="my-2" />
              <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                <SheetClose asChild>
                  <Button type="button" variant="outline" disabled={isPending}>
                    Cancel
                  </Button>
                </SheetClose>
                <Button
                  disabled={Object.keys(dirtyFields).length === 0 || isPending}
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
