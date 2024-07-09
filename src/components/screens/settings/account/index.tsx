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

export default function AccountScreen() {
  const currentUser = useSession();
  return (
    <div className="flex">
      <div className="w-[650px]">
        <h3 className="text-2xl font-semibold">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings
        </p>
        <Separator className="my-9" />
        <Card>
          <CardHeader>
            <CardTitle>Profile picture</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Avatar className="size-32">
              <AvatarImage src={currentUser.profileImageData ?? ""} />
              <AvatarFallback className="rounded-md">
                {currentUser.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </CardContent>
          <CardFooter>
            <UploadProfileDialog />
          </CardFooter>
        </Card>
        <UpdateUserForm
          email={currentUser.email}
          username={currentUser.username}
        />
      </div>
    </div>
  );
}
