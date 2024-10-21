"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface JsonViewerProps {
  data: any;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  if (typeof data !== "object" || data === null) {
    return <span>{JSON.stringify(data)}</span>;
  }

  const toggleOpen = () => setOpen(!open);

  const renderJsonContent = (jsonData: any, depth = 0) => {
    if (typeof jsonData !== "object" || jsonData === null) {
      return <span>{JSON.stringify(jsonData)}</span>;
    }

    return (
      <div style={{ marginLeft: `${depth * 20}px` }}>
        {Object.entries(jsonData).map(([key, value]) => (
          <div key={key}>
            <span className="text-blue-600">{key}: </span>
            {typeof value === "object" && value !== null ? (
              <JsonViewer data={value} />
            ) : (
              <span>{JSON.stringify(value)}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost2" size="sm" className="h-6" onClick={toggleOpen}>
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[400px] w-[300px] overflow-auto">
        <div className="font-mono text-sm">{renderJsonContent(data)}</div>
      </PopoverContent>
    </Popover>
  );
};

export default JsonViewer;
