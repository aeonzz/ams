import React from "react";

import { type ReservedTransportDateAndTime } from "@/lib/schema/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getStatusIcon, textTransform } from "@/lib/utils";

interface VehicleScheduleCardProps {
  data: ReservedTransportDateAndTime;
}

export default function VehicleScheduleCard({
  data,
}: VehicleScheduleCardProps) {
  return (
    <Card className="mb-2 bg-secondary">
      <CardHeader>
        <CardTitle className="truncate">{data.request.title}</CardTitle>
        <div className="flex space-x-2 flex-wrap">
          <Badge variant="outline" className="w-fit">
            {data.request.department}
          </Badge>
          <Badge
            variant={getStatusIcon(data.request.status).variant}
            className="w-fit"
          >
            {textTransform(data.request.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="space-y-1">
            <p className="text-xs">From:</p>
            <p className="text-sm">{format(data.dateAndTimeNeeded, "PPP")}</p>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
