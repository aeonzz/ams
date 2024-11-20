import React from "react";

import { type ReservedTransportDateAndTime } from "@/lib/schema/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn, formatFullName, getStatusColor, textTransform } from "@/lib/utils";
import { Dot } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { P } from "@/components/typography/text";

interface VehicleScheduleCardProps {
  className?: string;
  data: ReservedTransportDateAndTime;
}

export default function VehicleScheduleCard({
  className,
  data,
}: VehicleScheduleCardProps) {
  const { color, stroke, variant } = getStatusColor(data.request.status);
  return (
    <Card className={cn("mb-2 bg-secondary", className)}>
      <CardHeader>
        <div className="relative aspect-video h-20">
          <Image
            src={data.request.transportRequest.vehicle.imageUrl}
            alt={`Image of ${data.request.transportRequest.vehicle.name}`}
            fill
            className="rounded-md border object-cover"
          />
        </div>
        <CardTitle className="truncate">{data.request.title}</CardTitle>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2 rounded-sm border p-2">
            <Avatar className="size-10 rounded-full">
              <AvatarImage src={`${data.request.user.profileUrl}`} />
              <AvatarFallback className="rounded-md">
                {data.request.user.firstName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 truncate">
              <p className="text-xs text-muted-foreground">Requested by:</p>
              <P>
                {formatFullName(
                  data.request.user.firstName,
                  data.request.user.middleName,
                  data.request.user.lastName
                )}
              </P>
            </div>
          </div>
          <Badge variant="outline" className="w-fit">
            {data.request.department.name}
          </Badge>
          <Badge variant={variant} className="w-fit pr-3.5">
            <Dot
              className={cn("mr-1 size-3")}
              strokeWidth={stroke}
              color={color}
            />
            {textTransform(data.request.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="space-y-1">
            <p className="text-xs text-muted-foreground">Date needed</p>
            <p className="text-xs">{format(data.dateAndTimeNeeded, "PPP")}</p>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
