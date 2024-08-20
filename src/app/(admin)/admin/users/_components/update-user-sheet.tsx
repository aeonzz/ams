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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { RoleTypeSchema, User } from "prisma/generated/zod";
import { updateUserSchema, UpdateUserSchema } from "@/lib/schema/user";
import { Input } from "@/components/ui/input";
import { useServerActionMutation, useServerActionQuery } from "@/lib/hooks/server-action-hooks";
import { usePathname } from "next/navigation";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateUser } from "@/lib/actions/users";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { loadDepartments } from "@/lib/actions/department";

interface UpdateUserSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  user: User;
}

export function UpdateUserSheet({ user, ...props }: UpdateUserSheetProps) {
  const pathname = usePathname();
  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: user.email ?? "",
      department: user.department,
      username: user.username,
      role: user.role,
    },
  });

  const { dirtyFields } = useFormState({ control: form.control });
  const { isLoading, data } = useServerActionQuery(loadDepartments, {
    input: {},
    queryKey: ["asd"],
    refetchOnWindowFocus: false,
  });

  console.log(data)

  const { isPending, mutateAsync } = useServerActionMutation(updateUser);

  React.useEffect(() => {
    form.reset({
      email: user.email ?? "",
      department: user.department,
      username: user.username,
      role: user.role,
    });
  }, [user, form]);

  function onSubmit(values: UpdateUserSchema) {
    const data = {
      ...values,
      path: pathname,
      id: user.id,
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
              <div className="flex justify-between space-x-3">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="Aeonz"
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
                  name="department"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="bg-secondary capitalize"
                            disabled={isPending}
                          >
                            <SelectValue
                              placeholder={
                                isLoading ? (
                                  <LoadingSpinner />
                                ) : (
                                  "Select a department"
                                )
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-secondary">
                          <SelectGroup>
                            {data?.length === 0 ? (
                              <p className="p-4 text-center text-sm">
                                No departments yet
                              </p>
                            ) : (
                              <>
                                {data?.map((item) => (
                                  <SelectItem
                                    key={item.id}
                                    value={item.name}
                                    className="capitalize"
                                  >
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="bg-secondary capitalize"
                          disabled={isPending}
                        >
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-secondary">
                        <SelectGroup>
                          {RoleTypeSchema.options.map((item) => (
                            <SelectItem
                              key={item}
                              value={item}
                              className="capitalize"
                            >
                              {item}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
