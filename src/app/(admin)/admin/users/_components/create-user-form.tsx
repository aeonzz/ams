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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { CreateUserSchema } from "@/lib/schema/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUser } from "@/lib/actions/users";
import { Separator } from "@/components/ui/separator";
import { DialogFooter } from "@/components/ui/dialog";
import { type Department, type Role } from "prisma/generated/zod";
import { SubmitButton } from "@/components/ui/submit-button";
import { PasswordInput } from "@/components/ui/password-input";
import { UseMutateAsyncFunction, useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { usePathname } from "next/navigation";
import axios from "axios";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import CreateUserDialogSkeleton from "./create-user-dialog-skeleton";

interface CreateUserFormProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutateAsync: UseMutateAsyncFunction<
    any,
    Error,
    Parameters<typeof createUser>[0],
    unknown
  >;
  form: UseFormReturn<CreateUserSchema>;
  isPending: boolean;
  isFieldsDirty: boolean;
}

export default function CreateUserForm({
  setIsOpen,
  mutateAsync,
  isPending,
  form,
  isFieldsDirty,
  setAlertOpen,
}: CreateUserFormProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const { data, isLoading } = useQuery<Department[]>({
    queryFn: async () => {
      const res = await axios.get("/api/department/get-departments");
      return res.data.data;
    },
    queryKey: ["create-user-department-selection-users-table"],
  });

  async function onSubmit(values: CreateUserSchema) {
    const data = {
      ...values,
      path: pathname,
    };

    toast.promise(mutateAsync(data), {
      loading: "Creating...",
      success: () => {
        setIsOpen(false);
        return "User created successfully";
      },
      error: (err) => {
        console.log(err);
        return err.message;
      },
    });
  }

  if (isLoading) {
    return <CreateUserDialogSkeleton />;
  }

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="scroll-bar flex max-h-[55vh] flex-col gap-2 overflow-y-auto px-4 py-1">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="off"
                    placeholder="@email.com"
                    disabled={isPending}
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
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Enter first name"
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
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Enter middle name"
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Enter last name"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full gap-3">
            <FormField
              control={form.control}
              name="departmentIds"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Departments{" "}
                    <span className="text-xs text-muted-foreground">
                      (optional)
                    </span>
                  </FormLabel>
                  <Popover open={open} onOpenChange={setOpen} modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          disabled={isLoading || isPending}
                          className={cn(
                            "w-full justify-between",
                            !field.value?.length && "text-muted-foreground"
                          )}
                        >
                          {field.value && field.value?.length > 0
                            ? `${field.value.length} department${field.value.length > 1 ? "s" : ""} selected`
                            : "Select departments"}
                          {isLoading ? (
                            <LoadingSpinner />
                          ) : (
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search departments..." />
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
                                    const updatedValue = field.value?.includes(
                                      department.id
                                    )
                                      ? field.value.filter(
                                          (id) => id !== department.id
                                        )
                                      : [...(field.value || []), department.id];
                                    field.onChange(updatedValue);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value?.includes(department.id)
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
                  {field.value && field.value?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {field.value.map((departmentId) => {
                        const department = data?.find(
                          (d) => d.id === departmentId
                        );
                        return department ? (
                          <Badge key={department.id} variant="outline">
                            {department.name}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-1 h-auto p-0 text-muted-foreground"
                              onClick={() => {
                                field.onChange(
                                  field.value?.filter(
                                    (id) => id !== department.id
                                  )
                                );
                              }}
                            >
                              ×
                            </Button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    id="password"
                    placeholder="Enter password"
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Re-Enter your password</FormLabel>
                <FormControl>
                  <PasswordInput
                    id="confirm-password"
                    placeholder="Re-Enter password"
                    disabled={isPending}
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
                  setIsOpen(false);
                }
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <SubmitButton disabled={isPending} type="submit" className="w-20">
              Create
            </SubmitButton>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}
