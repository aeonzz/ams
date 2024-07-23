import React from "react";
import { CommandShortcut } from "./command";
import { P } from "../typography/text";

interface CommandTooltipProps {
  children: React.ReactNode;
  text: string;
}

export default function CommandTooltip({
  children,
  text,
}: CommandTooltipProps) {
  return (
    <div className="flex items-center space-x-3">
      <P>{text}</P>
      <div className="space-x-1">
        {children}
      </div>
    </div>
  );
}
