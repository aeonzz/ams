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
import { PhotoProvider, PhotoView } from "react-photo-view";
import LoadingSpinner from "@/components/loaders/loading-spinner";
import { CircleMinus, CirclePlus, RotateCw } from "lucide-react";
import { textTransform } from "@/lib/utils";

export default function ProfileScreen() {
  const currentUser = useSession();

  return (
    <ScrollArea className="h-[calc(100vh_-_130px)] py-3 lg:h-[calc(100vh_-_100px)]">
      <div className="flex flex-col px-3">
        <div className="w-full">
          <H2 className="font-semibold">Account</H2>
          <P className="text-muted-foreground">Update your account settings</P>
          <Separator className="my-6" />
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {currentUser.profileUrl ? (
                <PhotoProvider
                  speed={() => 300}
                  maskOpacity={0.8}
                  loadingElement={<LoadingSpinner />}
                  toolbarRender={({ onScale, scale, rotate, onRotate }) => {
                    return (
                      <>
                        <div className="flex gap-3">
                          <CirclePlus
                            className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                            onClick={() => onScale(scale + 1)}
                          />
                          <CircleMinus
                            className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                            onClick={() => onScale(scale - 1)}
                          />
                          <RotateCw
                            className="size-5 cursor-pointer opacity-75 transition-opacity ease-linear hover:opacity-100"
                            onClick={() => onRotate(rotate + 90)}
                          />
                        </div>
                      </>
                    );
                  }}
                >
                  <div>
                    <PhotoView
                      key={currentUser.id}
                      src={currentUser.profileUrl}
                    >
                      <div
                        key={currentUser.id}
                        className="relative mb-3 w-full cursor-pointer"
                      >
                        <Avatar className="size-32 border">
                          <AvatarImage src={`${currentUser.profileUrl}`} />
                          <AvatarFallback className="rounded-md">
                            {currentUser.firstName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </PhotoView>
                  </div>
                </PhotoProvider>
              ) : (
                <Avatar className="size-32 border">
                  <AvatarImage src={`${currentUser.profileUrl}`} />
                  <AvatarFallback className="rounded-md">
                    {currentUser.firstName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </CardContent>
            <CardFooter>
              <UploadProfileDialog />
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 w-full">
          <H2 className="font-semibold">Departments</H2>
          <P className="text-muted-foreground">Your assigned departments</P>
          <Separator className="my-6 w-full" />
          <div className="grid grid-cols-2 gap-3 lg:w-[750px] lg:grid-cols-3">
            {currentUser.userDepartments.map((userDepartment) => (
              <Card key={userDepartment.id} className="w-lg bg-secondary">
                <CardHeader>
                  <CardTitle>{userDepartment.department.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <P className="font-medium">
                    Type:{" "}
                    {textTransform(userDepartment.department.departmentType)}
                  </P>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
