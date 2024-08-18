"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { updateUserSchema, UpdateUserSchema } from "@/lib/schema/client/user";
import { Input } from "@/components/ui/input";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { usePathname } from "next/navigation";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateUser } from "@/lib/actions/users";

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

  const { mutate, isPending } = useServerActionMutation(updateUser, {
    onSuccess: () => {
      props.onOpenChange?.(false);
      toast.success("User Created Successfully!", {
        description: "The new user has been created successfully.",
      });
    },
    onError: (err) => {
      console.log(err);
      toast.error("Uh oh! Something went wrong.", {
        description: "Something went wrong, please try again later.",
      });
    },
  });

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
    };
    mutate(data);
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update task</SheetTitle>
          <SheetDescription>
            Update the task details and save the changes
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
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
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="IT"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
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
            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <SubmitButton disabled={isPending} type="submit" className="w-20">
                Create
              </SubmitButton>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
