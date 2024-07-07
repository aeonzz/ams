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

export default function PreferencesScreen() {
  const { setTheme, theme } = useTheme();
  const [value, setValue] = useState(theme || "system");

  useEffect(() => {
    setTheme(value);
  }, [value]);

  return (
    <div className="flex">
      <div className="w-[650px]">
        <h3 className="text-2xl font-semibold">Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Customize your settings and personalize your experience.
        </p>
        <Separator className="my-9" />
        {/* <Button asChild variant={"ghost"} className="h-fit w-fit" onClick={() => setTheme("light")}>
          <div className="flex flex-col">
            <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
              <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">Light</span>
          </div>
        </Button>
        <Button asChild variant={"ghost"} onClick={() => setTheme("dark")} className="h-fit w-fit">
          <div className="flex flex-col">
            <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
              <div className="space-y-2 rounded-sm bg-neutral-950 p-2">
                <div className="space-y-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-neutral-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-neutral-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-neutral-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">Dark</span>
          </div>
        </Button>
        <Button asChild variant={"ghost"} onClick={() => setTheme("system")} className="h-fit w-fit">
          <div className="flex flex-col">
            <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
              <div className="space-y-2 rounded-sm bg-neutral-300 p-2">
                <div className="space-y-2 rounded-md bg-neutral-600 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-neutral-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-neutral-600 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-neutral-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-neutral-600 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-neutral-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">System</span>
          </div>
        </Button> */}
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
                  <SelectItem value="light" onClick={() => setTheme("light")}>
                    Light
                  </SelectItem>
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
