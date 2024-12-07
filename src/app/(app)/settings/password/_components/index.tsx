"use client";

import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { H2, P } from "@/components/typography/text";
import { ScrollArea } from "@/components/ui/scroll-area";
import ResetPasswordForm from "@/components/forms/reset-password-form";

export default function PasswordScreen() {
  return (
    <ScrollArea className="h-full w-full py-3 lg:w-auto">
      <div className="flex px-3">
        <div className="w-full lg:w-[650px]">
          <H2 className="font-semibold">Password</H2>
          <P className="text-muted-foreground">Change your account password</P>
          <Separator className="my-6" />
          <Card className="bg-secondary">
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
