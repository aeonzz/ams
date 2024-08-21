"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import {
  SectionItem,
  SectionItemAction,
  SectionItemDescription,
  SectionItemHeader,
  SectionItemTitle,
} from "../../_components/section";

export default function ThemeItem() {
  const { setTheme, theme } = useTheme();
  const [value, setValue] = useState(theme || "system");

  useEffect(() => {
    setTheme(value);
  }, [value]);

  return (
    <SectionItem>
      <SectionItemHeader>
        <SectionItemTitle>Interface theme</SectionItemTitle>
        <SectionItemDescription>
          Adjust the appearance of the application to suit your style.
        </SectionItemDescription>
      </SectionItemHeader>
      <SectionItemAction>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </SectionItemAction>
    </SectionItem>
  );
}
