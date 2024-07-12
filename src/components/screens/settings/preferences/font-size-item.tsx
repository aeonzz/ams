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
import { useFontSize } from "@/lib/hooks/use-font-size";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";

export default function FontSizeItem() {
  const { fontSize, setFontSize } = useFontSize();
  const [value, setValue] = useState<string | undefined>(fontSize);
  // const { data, mutate } = useServerActionMutation(helloWorldAction)


  useEffect(() => {
    setFontSize(value);
  }, [value]);

  return (
    <SectionItem>
      <SectionItemHeader>
        <SectionItemTitle>Font size</SectionItemTitle>
        <SectionItemDescription>Adjust font size.</SectionItemDescription>
      </SectionItemHeader>
      <SectionItemAction>
        <Select value={value} onValueChange={setValue}>
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
