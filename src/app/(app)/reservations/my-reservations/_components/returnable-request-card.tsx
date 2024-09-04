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
import { Calendar, Clock, MapPin, Users, Truck, Package } from "lucide-react";
import { format } from "date-fns";
import { type RequestWithRelations } from "prisma/generated/zod";
import { getStatusIcon } from "@/lib/utils";

interface ReturnableRequestCardProps {
  request: RequestWithRelations;
}

export default function ReturnableRequestCard({
  request,
}: ReturnableRequestCardProps) {
  const { icon: Icon, variant } = getStatusIcon(request.status);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{request.title}</span>
          <Badge variant={variant}>{request.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            <span>{request.returnableRequest?.item.inventory.name}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>Quantity: {request.returnableRequest?.quantity}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              {request.returnableRequest?.dateAndTimeNeeded
                ? format(
                    new Date(request.returnableRequest.dateAndTimeNeeded),
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
                : "No sdateAndTimeNeeded available"}
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {request.returnableRequest?.purpose}
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
