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
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema } from "../../lib/schema/client/user";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { createUser } from "@/lib/actions/users";
import { Separator } from "../ui/separator";
import { DialogFooter } from "../ui/dialog";
import { RoleTypeSchema } from "prisma/generated/zod";
import { SubmitButton } from "../ui/submit-button";
import { PasswordInput } from "../ui/password-input";
import { UseMutateFunction } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { usePathname } from "next/navigation";

interface CreateUserFormProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: UseMutateFunction<
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
  mutate,
  isPending,
  form,
  isFieldsDirty,
  setAlertOpen,
}: CreateUserFormProps) {
  const pathname = usePathname();

  async function onSubmit(values: CreateUserSchema) {
    const data = {
      ...values,
      path: pathname,
    };

    mutate(data);
  }

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
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
