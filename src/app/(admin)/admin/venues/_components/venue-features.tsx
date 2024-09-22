"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface VenueFeaturesProps {
  field: {
    value: string | string[] | undefined;
    onChange: (value: string | string[]) => void;
  };
  disabled: boolean;
  error?: string;
  setError: (error: string | undefined) => void;
}

export default function VenueFeatures({
  field,
  disabled,
  error,
  setError,
}: VenueFeaturesProps) {
  const [features, setFeatures] = useState<string[]>(() => {
    if (Array.isArray(field.value)) {
      return field.value;
    }
    if (typeof field.value === "string") {
      try {
        return JSON.parse(field.value);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (Array.isArray(field.value)) {
      setFeatures(field.value);
    } else if (typeof field.value === "string") {
      try {
        setFeatures(JSON.parse(field.value));
      } catch {
        setFeatures([]);
      }
    }
  }, [field.value]);

  const addFeature = () => {
    const newFeatures = [...features, ""];
    setFeatures(newFeatures);
    updateFieldValue(newFeatures);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    updateFieldValue(newFeatures);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = features.map((feature, i) =>
      i === index ? value : feature
    );
    setFeatures(newFeatures);
    updateFieldValue(newFeatures);
  };

  const updateFieldValue = (newFeatures: string[]) => {
    const hasEmptyFeature = newFeatures.some(
      (feature) => feature.trim() === ""
    );
    if (hasEmptyFeature) {
      setError("All features must have a value");
    } else {
      setError(undefined);
    }
    field.onChange(newFeatures);
  };

  return (
    <FormItem>
      <FormLabel>Features</FormLabel>
      <FormControl>
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Enter a feature"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                disabled={disabled}
                className={
                  error && feature.trim() === "" ? "border-destructive" : ""
                }
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeFeature(index)}
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFeature}
            disabled={disabled}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Feature
          </Button>
        </div>
      </FormControl>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}
