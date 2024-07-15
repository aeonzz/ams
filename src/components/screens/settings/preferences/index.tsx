import React, { useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator";
import { Section, SectionTitle } from "@/components/screens/settings/section";
import FontSizeItem from "./font-size-item";
import { H2, P } from "@/components/typography/text";
import ThemeItem from "./theme-item";

export default function PreferencesScreen() {
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
          <ThemeItem />
        </Section>
      </div>
    </div>
  );
}
