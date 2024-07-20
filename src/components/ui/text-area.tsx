import * as React from "react";

import { cn, getFontSizeClass } from "@/lib/utils";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";
import { useFontSize } from "@/lib/hooks/use-font-size";

export interface TextareaProps extends TextareaAutosizeProps {
  defaultSize?: string;
  small?: string;
  large?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      defaultSize = "text-base",
      small = "text-sm",
      large = "text-lg",
      ...props
    },
    ref
  ) => {
    const { fontSize } = useFontSize();

    const fontSizeClass = getFontSizeClass(fontSize, defaultSize, small, large);
    return (
      <TextareaAutosize
        className={cn(
          fontSizeClass,
          "scroll-bar flex min-h-[60px] w-full resize-none rounded-md border bg-input px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
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
