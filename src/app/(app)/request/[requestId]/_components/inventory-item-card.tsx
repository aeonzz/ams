"use client";

import { P } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import { getReturnableItemStatusIcon, textTransform } from "@/lib/utils";
import Image from "next/image";
import { type InventorySubItemWithRelations } from "prisma/generated/zod";
import React from "react";

interface InventoryItemCardProps {
  inventoryItem: InventorySubItemWithRelations;
}

export default function InventoryItemCard({
  inventoryItem,
}: InventoryItemCardProps) {
  const {icon: Icon, variant} = getReturnableItemStatusIcon(inventoryItem.status)
  return (
    <div className="flex rounded-lg border bg-tertiary p-3">
      <div className="flex space-x-2">
        <div className="relative aspect-square h-12 cursor-pointer transition-colors hover:brightness-75">
          <Image
            src={inventoryItem.inventory.imageUrl}
            alt={`Image of ${inventoryItem.inventory.name}`}
            fill
            className="rounded-md border object-cover"
          />
        </div>
        <div className="flex flex-col">
          <P className="font-semibold">{inventoryItem.inventory.name}</P>
          <P className="font-normal text-muted-foreground">
            {textTransform(inventoryItem.subName)}
          </P>
        </div>
      </div>
      <div className="ml-auto flex items-center space-x-3">
        <Badge variant={variant} className="h-fit">
          <Icon className="mr-1 size-4" />
          {textTransform(inventoryItem.status)}
        </Badge>
      </div>
    </div>
  );
}
