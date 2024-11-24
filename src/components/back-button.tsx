"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost2"
      size="icon"
      className="size-7"
      onClick={() => router.back()}
    >
      <ChevronLeft className="size-4" />
    </Button>
  );
}
