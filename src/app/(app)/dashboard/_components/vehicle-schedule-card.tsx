import React from "react";

import { type ReservedTransportDateAndTime } from "@/lib/schema/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn, getStatusColor, textTransform } from "@/lib/utils";
import { Dot } from "lucide-react";

interface VehicleScheduleCardProps {
  data: ReservedTransportDateAndTime;
}

export default function VehicleScheduleCard({
  data,
}: VehicleScheduleCardProps) {
  const { color, stroke, variant } = getStatusColor(data.request.status);
  return (
    <Card className="mb-2 bg-secondary">
      <CardHeader>
        <CardTitle className="truncate">{data.request.title}</CardTitle>
        <div className="flex flex-wrap space-x-2">
          <Badge variant="outline" className="w-fit">
            {data.request.department}
          </Badge>
          <Badge variant={variant} className="pr-3.5">
            <Dot className={cn("mr-1 size-3", color)} strokeWidth={stroke} />
            {textTransform(data.request.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="space-y-1">
            <p className="text-xs">Needed:</p>
            <p className="text-sm">{format(data.dateAndTimeNeeded, "PPP")}</p>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
