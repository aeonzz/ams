import React, { useEffect, useState } from "react";
import {
  SectionItem,
  SectionItemAction,
  SectionItemDescription,
  SectionItemHeader,
  SectionItemTitle,
} from "../section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "zustand";
import { useFontSize } from "@/lib/hooks/use-font-size";

export default function FontSizeItem() {
  const font = useStore(useFontSize, (state) => state);

  return (
    <SectionItem>
      <SectionItemHeader>
        <SectionItemTitle>Font size</SectionItemTitle>
        <SectionItemDescription>Adjust font size.</SectionItemDescription>
      </SectionItemHeader>
      <SectionItemAction>
        <Select value={font.fontSize} onValueChange={font.setFontSize}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </SectionItemAction>
    </SectionItem>
  );
}
