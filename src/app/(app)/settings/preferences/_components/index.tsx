import { Separator } from "@/components/ui/separator";
import FontSizeItem from "./font-size-item";
import { H2, P } from "@/components/typography/text";
import ThemeItem from "./theme-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Section, SectionTitle } from "../../_components/section";

export default function PreferencesScreen() {
  return (
    <ScrollArea className="h-full py-3">
      <div className="flex px-3">
        <div className="w-[650px]">
          <H2 className="font-semibold">Preferences</H2>
          <P className="text-muted-foreground">
            Customize your settings and personalize your experience.
          </P>
          <Separator className="my-6" />
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
    </ScrollArea>
  );
}
