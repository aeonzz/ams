"use client";

import React from "react";
import { PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagInputProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  value: string[];
  onChange: (value: string[]) => void;
  maxTags?: number;
  className?: string;
  inputClassName?: string;
  tagClassName?: string;
  autoFocus?: boolean;
}

export function TagInput({
  label,
  placeholder = "Enter a tag",
  disabled = false,
  value,
  onChange,
  maxTags,
  className,
  inputClassName,
  autoFocus = false,
  tagClassName,
}: TagInputProps) {
  const [currentInput, setCurrentInput] = React.useState("");

  const addTag = (tag: string) => {
    if (tag.trim() && (!maxTags || value.length < maxTags)) {
      const newTags = [...value, tag.trim()];
      onChange(newTags);
      setCurrentInput("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(currentInput);
    }
  };

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="rounded-md border p-1">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={placeholder}
            disabled={disabled}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus={autoFocus}
            className={cn(
              "border-none p-0 px-2 outline-none ring-offset-secondary focus-visible:ring-0 focus-visible:ring-offset-0",
              inputClassName
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => addTag(currentInput)}
            disabled={
              disabled ||
              !currentInput.trim() ||
              (maxTags !== undefined && value.length >= maxTags)
            }
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <div className={cn(value.length > 0 && "mt-1", "flex flex-wrap gap-2")}>
          {value.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className={cn("px-2 py-1 text-sm", tagClassName)}
            >
              {tag}
              <Button
                type="button"
                variant="ghost2"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => removeTag(index)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
