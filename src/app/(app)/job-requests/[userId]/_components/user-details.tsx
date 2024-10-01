import React from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import type { UserWithRelations } from "prisma/generated/zod";
import placeholder from "public/placeholder.svg";
import { H3, P } from "@/components/typography/text";
import { formatFullName } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface UserDetailsProps {
  user: UserWithRelations;
}

export default function UserDetails({ user }: UserDetailsProps) {
  return (
    <div className="p-3">
      <div className="flex gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative size-20 cursor-pointer rounded-full transition-colors hover:brightness-75">
              <Image
                src={user.profileUrl ?? placeholder}
                alt={`Image of ${user.firstName}`}
                fill
                className="rounded-full border object-cover"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="aspect-square w-[80vw]">
            <Image
              src={user.profileUrl ?? placeholder}
              alt={`Image of ${user.firstName}`}
              fill
              className="rounded-md border object-cover"
            />
          </DialogContent>
        </Dialog>
        <div className="">
          <H3 className="font-semibold">
            {formatFullName(user.firstName, user.middleName, user.lastName)}
          </H3>
          <P className="text-muted-foreground">{user.email}</P>
          <div className="flex space-x-1 mt-2">
            {user.userDepartments.map((department) => (
              <Badge key={department.id} variant="outline">
                {department.department.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
