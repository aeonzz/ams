"use client";

import React from "react";

import { useSession } from "@/lib/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UploadProfileDialog from "@/components/dialogs/upload-profile-dialog";

export default function AccountScreen() {
  const currentUser = useSession();
  console.log(currentUser);
  return (
    <div className="flex justify-center">
      <div className="w-[650px] px-5">
        <h3 className="text-2xl font-semibold">Account</h3>
        <p className="text-sm text-muted-foreground">Update your account settings</p>
        <Separator className="my-6" />
        <Card>
          <CardHeader>
            <CardTitle>Profile picture</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Avatar className="size-32">
              <AvatarImage src={currentUser.profileUrl ?? ""} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </CardContent>
          <CardFooter>
            <UploadProfileDialog />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
