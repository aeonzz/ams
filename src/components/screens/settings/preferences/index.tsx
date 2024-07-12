"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { Separator } from "@/components/ui/separator";
import {
  Section,
  SectionTitle,
  SectionItem,
  SectionItemAction,
  SectionItemDescription,
  SectionItemHeader,
  SectionItemTitle,
} from "@/components/screens/settings/section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FontSizeItem from "./font-size-item";
import { useFontSize } from "@/lib/hooks/use-font-size";
import { cn } from "@/lib/utils";
import { H2, P } from "@/components/typography/text";

export default function PreferencesScreen() {
  const { fontSize } = useFontSize();
  const { setTheme, theme } = useTheme();
  const [value, setValue] = useState(theme || "system");

  useEffect(() => {
    setTheme(value);
  }, [value]);

  return (
    <div className="flex">
      <div className="w-[650px]">
        <H2 className="font-semibold">Preferences</H2>
        <P className="text-muted-foreground">
          Customize your settings and personalize your experience.
        </P>
        <Separator className="mt-9" />
        <Section>
          <SectionTitle>Display</SectionTitle>
          <FontSizeItem />
        </Section>
        <Section>
          <SectionTitle>Theme</SectionTitle>
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
        </Section>
      </div>
    </div>
  );
}
