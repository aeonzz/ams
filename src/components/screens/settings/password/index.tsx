"use client";

import React from "react";

import { useSession } from "@/lib/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UploadProfileDialog from "@/components/dialogs/upload-profile-dialog";
import UpdateUserForm from "@/components/forms/update-user-form";
import { H2, P } from "@/components/typography/text";
import { ScrollArea } from "@/components/ui/scroll-area";
import ResetPasswordForm from "@/components/forms/reset-password-form";

export default function PasswordScreen() {
  const currentUser = useSession();
  return (
    <ScrollArea className="h-full py-3">
      <div className="flex px-3">
        <div className="w-[650px]">
          <H2 className="font-semibold">Password</H2>
          <P className="text-muted-foreground">Change your account password</P>
          <Separator className="my-6" />
          <Card>
            <CardHeader>
              <CardTitle>Set Password</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResetPasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
