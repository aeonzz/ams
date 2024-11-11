"use client";

import { H3, H5, H6, P } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { textTransform } from "@/lib/utils";
import Image from "next/image";
import { type SupplyRequestItemWithRelations } from "prisma/generated/zod";
import React from "react";

interface ItemCardProps {
  supplyRequest: SupplyRequestItemWithRelations;
}

export default function SupplyItemCard({ supplyRequest }: ItemCardProps) {
  return (
    <div className="flex rounded-lg border bg-tertiary p-3">
      <div className="flex space-x-2">
        <div className="relative aspect-square h-12 cursor-pointer transition-colors hover:brightness-75">
          <Image
            src={supplyRequest.supplyItem.imageUrl}
            alt={`Image of ${supplyRequest.supplyItem.name}`}
            fill
            className="rounded-md border object-cover"
          />
        </div>
        <div className="flex flex-col">
          <P className="font-semibold">{supplyRequest.supplyItem.name}</P>
          <P className="font-normal text-muted-foreground">
            {textTransform(supplyRequest.supplyItem.category.name)}
          </P>
        </div>
      </div>
      <div className="ml-auto flex items-center space-x-3">
        <P>{supplyRequest.quantity} X</P>
        <Badge variant="outline" className="h-fit">
          {textTransform(supplyRequest.supplyItem.status)}
        </Badge>
      </div>
    </div>
  );
}
