"use client";

import { H4 } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { CommandShortcut } from "@/components/ui/command";
import CommandTooltip from "@/components/ui/command-tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";

export default function RequestSummaryTitle() {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const [isCopying, setIsCopying] = React.useState(false);

  const getFullUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${pathname}`;
    }
    return pathname;
  };

  const copyToClipboard = async () => {
    setIsCopying(true);
    try {
      const fullUrl = getFullUrl();
      await navigator.clipboard.writeText(fullUrl);
      toast("The full URL has been copied to your clipboard.");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("There was an error copying the URL. Please try again.");
    } finally {
      setIsCopying(false);
    }
  };

  useHotkeys(
    "mod+shift+l",
    (event) => {
      event.preventDefault();
      copyToClipboard();
    },
    { enableOnFormTags: false, enabled: isDesktop }
  );

  return (
    <div className="flex items-center justify-between py-2.5">
      <H4 className="font-semibold text-muted-foreground">Request Summary</H4>
      {isDesktop ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost2"
              size="icon"
              className="size-7"
              onClick={copyToClipboard}
              disabled={isCopying}
            >
              <Link className="size-4 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-3" side="bottom">
            <CommandTooltip text="Copy full request URL">
              <CommandShortcut>Ctrl</CommandShortcut>
              <CommandShortcut>Shift</CommandShortcut>
              <CommandShortcut>L</CommandShortcut>
            </CommandTooltip>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Button
          variant="ghost2"
          size="icon"
          className="size-7"
          onClick={copyToClipboard}
          disabled={isCopying}
        >
          <Link className="size-4 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
}
