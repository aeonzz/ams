"use client";

import type { SupplyItemWithRelations } from "prisma/generated/zod";
import React from "react";

interface SupplyItemCardProps {
  item: SupplyItemWithRelations;
}

export default function SupplyItemCard({}: SupplyItemCardProps) {
  return <div>SupplyItemCard</div>;
}
