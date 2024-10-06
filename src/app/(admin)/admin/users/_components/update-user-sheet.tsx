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
import { Department } from "prisma/generated/zod";
import { UpdateUserSchema, updateUserSchema } from "@/lib/schema/user";
import { Input } from "@/components/ui/input";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { usePathname } from "next/navigation";
import { updateUser } from "@/lib/actions/users";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { textTransform } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { type UserType } from "@/lib/types/user";

interface UpdateUserSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  user: UserType;
}

export function UpdateUserSheet({ user, ...props }: UpdateUserSheetProps) {
  const pathname = usePathname();
  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName ?? "",
      lastName: user.lastName,
    },
  });

  const { dirtyFields } = useFormState({ control: form.control });
  const { data, isLoading } = useQuery<Department[]>({
    queryFn: async () => {
      const res = await axios.get("/api/department/get-departments");
      return res.data.data;
    },
    queryKey: ["update-user-sheet-department-input"],
  });

  const { isPending, mutateAsync } = useServerActionMutation(updateUser);

  React.useEffect(() => {
    form.reset({
      email: user.email ?? "",
      firstName: user.firstName,
      middleName: user.middleName ?? "",
      lastName: user.lastName,
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
          <SheetTitle>Update user</SheetTitle>
          <SheetDescription>
            Update the user details and save the changes
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-screen flex-col justify-between"
          >
            <div className="scroll-bar relative max-h-[75vh] space-y-2 overflow-y-auto px-4 pb-1">
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
              {/* <FormField
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
                          {RoleTypeSchema.options.map((role) => {
                            const { icon: Icon, variant } = getRoleIcon(role);
                            return (
                              <SelectItem
                                key={role}
                                value={role}
                                className="capitalize"
                              >
                                <Badge variant={variant}>
                                  <Icon className="mr-1 size-4" />
                                  {textTransform(role)}
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
              /> */}
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
