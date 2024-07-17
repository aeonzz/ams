import * as React from "react";

import { cn, getFontSizeClass } from "@/lib/utils";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";
import { useFontSize } from "@/lib/hooks/use-font-size";

export interface TextareaProps extends TextareaAutosizeProps {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const { fontSize } = useFontSize();

    const fontSizeClass = getFontSizeClass(
      fontSize,
      "text-base",
      "text-sm",
      "text-lg"
    );
    return (
      <TextareaAutosize
        className={cn(
          fontSizeClass,
          "flex min-h-[60px] w-full resize-none rounded-md border bg-input px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
