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

export default function ProfileScreen() {
  const currentUser = useSession();
  return (
    <ScrollArea className="h-full py-3">
      <div className="flex px-3">
        <div className="w-[650px]">
          <H2 className="font-semibold">Profile</H2>
          <P className="text-muted-foreground">Update your profile settings</P>
          <Separator className="my-6" />
          <Card>
            <CardHeader>
              <CardTitle>Profile picture</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Avatar className="size-32">
                <AvatarImage src={`${currentUser.profileUrl}` ?? ""} />
                <AvatarFallback className="rounded-md">
                  {currentUser.firstName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </CardContent>
            <CardFooter>
              <UploadProfileDialog />
            </CardFooter>
          </Card>
          {/* <UpdateUserForm
            email={currentUser.email}
            username={currentUser.username}
          /> */}
        </div>
      </div>
    </ScrollArea>
  );
}
