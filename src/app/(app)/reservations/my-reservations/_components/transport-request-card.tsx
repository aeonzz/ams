import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Truck,
  Package,
  Dot,
} from "lucide-react";
import { format } from "date-fns";
import { type RequestWithRelations } from "prisma/generated/zod";
import { cn, getStatusColor, textTransform } from "@/lib/utils";

interface TransportRequestCardProps {
  request: RequestWithRelations;
}

export default function TransportRequestCard({
  request,
}: TransportRequestCardProps) {
  const { color, stroke, variant } = getStatusColor(request.status);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{request.title}</span>
          <Badge variant={variant} className="pr-3.5">
            <Dot className={cn("mr-1 size-3", color)} strokeWidth={stroke} />
            {textTransform(request.status)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Truck className="mr-2 h-4 w-4" />
            <span>{request.transportRequest?.vehicle.name}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{request.transportRequest?.destination}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              {request.transportRequest?.dateAndTimeNeeded
                ? format(
                    new Date(request.transportRequest.dateAndTimeNeeded),
                    "PPP"
                  )
                : "No sdateAndTimeNeeded available"}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>
              {request.transportRequest?.dateAndTimeNeeded
                ? format(
                    new Date(request.transportRequest.dateAndTimeNeeded),
                    "P"
                  )
                : "No dateAndTimeNeeded available"}
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {request.transportRequest?.description}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
